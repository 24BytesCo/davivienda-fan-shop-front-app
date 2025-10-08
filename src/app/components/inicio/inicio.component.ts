import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';
import { CategoriaProducto } from 'src/app/core/models/product.enums';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  loading = false;
  products: Product[] = [];
  byCategory: { key: string; items: Product[] }[] = [];
  newArrivals: Product[] = [];
  // Detalle (modal)
  showDetail = false;
  detail: Product | null = null;
  detailImageIndex = 0;

  categoriesOrder = [
    CategoriaProducto.ACCESORIOS,
    CategoriaProducto.ROPA,
    CategoriaProducto.HOGAR,
    CategoriaProducto.OFICINA,
  ];

  constructor(private api: ProductService, private cart: CartService) {}

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.loading = true;
    this.api.list$(1, 100).subscribe(
      (res) => {
        this.products = res.items || [];
        this.computeGroups();
        this.loading = false;
      },
      (_) => { this.loading = false; }
    );
  }

  private computeGroups(): void {
    const groups = new Map<string, Product[]>();
    for (const p of this.products) {
      const k = (p.category || 'otros').toString().toLowerCase();
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(p);
    }
    const orderKeys = Array.from(groups.keys()).sort((a, b) => {
      const ia = this.categoriesOrder.indexOf(a as CategoriaProducto);
      const ib = this.categoriesOrder.indexOf(b as CategoriaProducto);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    this.byCategory = orderKeys.map((k) => ({
      key: k,
      items: (groups.get(k)! ).sort((a,b) =>
        (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0)
      )
    }));

    const withDate = [...this.products].filter((p) => !!p.createdAt);
    if (withDate.length) {
      withDate.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
      this.newArrivals = withDate.slice(0, 4);
    } else {
      this.newArrivals = this.products.slice(0, 4);
    }
  }

  // ---------- Detalles ----------
  openDetails(p: Product) {
    this.detail = p;
    this.detailImageIndex = 0;
    this.showDetail = true;
  }
  closeDetails() {
    this.showDetail = false;
    this.detail = null;
    this.detailImageIndex = 0;
  }
  setDetailImage(i: number) {
    if (!this.detail?.images) return;
    if (i < 0 || i >= this.detail.images.length) return;
    this.detailImageIndex = i;
  }

  addToCart(p: Product) {
    this.cart.add(p.id, 1, p).subscribe();
  }
}
