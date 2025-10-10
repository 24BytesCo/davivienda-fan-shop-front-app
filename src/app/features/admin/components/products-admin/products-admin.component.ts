import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { CategoriaProducto, TallasValidas } from 'src/app/core/models/product.enums';
import { Product } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.css']
})
export class ProductsAdminComponent implements OnInit {
  @ViewChild('formRef') formRef?: NgForm;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;
  // Listado
  products: Product[] = [];
  page = 1;
  limit = 10;
  offset = 0;
  hasNext = false;
  q = '';
  loading = false;

  // Formulario
  showForm = false;
  editing: Product | null = null;
  form: any = this.defaultForm();
  sizesSelect: string[] = [];
  files: File[] = [];
  previews: string[] = [];

  // Enumerables para selects
  categories = Object.values(CategoriaProducto); // valores en minúscula
  sizesOptions = Object.values(TallasValidas);   // valores en MAYÚSCULA

  // Detalles (modal)
  showDetail = false;
  detail: Product | null = null;
  detailImageIndex = 0;

  constructor(private api: ProductService, private notify: NotificationService) {}

  /** Carga inicial del listado de productos. */
  ngOnInit(): void {
    this.fetch();
  }

  /** Recupera productos paginados desde la API. */
  fetch(p: number = this.page): void {
    this.loading = true;
    this.api.list$(p, this.limit, this.q).subscribe(
      (res) => {
        this.products = res.items;
        this.page = res.page ?? p;
        this.offset = res.offset ?? (this.page - 1) * this.limit;
        this.hasNext = !!res.hasNext;
      },
      () => {
        this.notify.error('No fue posible cargar productos');
        this.loading = false;
      },
      () => (this.loading = false)
    );
  }

  /** Cambia de página del listado. */
  goToPage(p: number) {
    if (p < 1) return;
    this.fetch(p);
  }

  /** Abre el formulario para crear un producto. */
  openCreate() {
    this.editing = null;
    this.form = this.defaultForm();
    this.sizesSelect = [];
    this.files = [];
    this.previews = [];
    this.showForm = true;
    setTimeout(() => this.resetNgForm(this.form));
  }

  /** Abre el formulario para editar un producto. */
  openEdit(p: Product) {
    this.editing = p;
    this.form = {
      title: p.title,
      points: p.points,
      stock: p.stock,
      category: (p.category ?? '').toString().toLowerCase(),
      description: p.description ?? '',
      sizesText: ''
    };
    this.sizesSelect = (p.sizes ?? []).map(s => s.toString().toUpperCase());
    this.files = [];
    this.previews = (p.images ?? []).map(i => i.url);
    this.showForm = true;
    setTimeout(() => this.resetNgForm(this.form));
  }

  /** Cancela edición/creación y limpia el formulario. */
  cancel() {
    this.showForm = false;
    this.clearFilesUI();
    this.form = this.defaultForm();
    this.resetNgForm(this.form);
  }

  /** Gestiona selección de imágenes y genera previsualizaciones. */
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.files = Array.from(input.files);
    // Previews
    this.previews = [];
    this.files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.previews.push(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  // ---------- Detalles ----------
  /** Abre el modal de detalles del producto. */
  openDetails(p: Product) {
    this.detail = p;
    this.detailImageIndex = 0;
    this.showDetail = true;
  }
  /** Cierra el modal de detalles. */
  closeDetails() {
    this.showDetail = false;
    this.detail = null;
    this.detailImageIndex = 0;
  }
  /** Cambia la imagen activa en el modal de detalles. */
  setDetailImage(i: number) {
    if (!this.detail?.images) return;
    if (i < 0 || i >= this.detail.images.length) return;
    this.detailImageIndex = i;
  }

  /** Crea o actualiza un producto en la API. */
  save() {
    const payload = {
      title: this.form.title,
      description: this.form.description,
      points: Number(this.form.points) || 0,
      stock: Number(this.form.stock) || 0,
      category: (this.form.category || '').toString().toLowerCase(),
      sizes: (this.sizesSelect || [])
        .map(s => s.toString().toUpperCase())
    } as Partial<Product>;

    const req$: Observable<any> = this.editing
      ? this.api.update$(this.editing.id, payload, this.files)
      : this.api.create$(payload, this.files);

    this.loading = true;
    req$.subscribe(
      () => {
        this.loading = false;
        this.notify.toastSuccess(this.editing ? 'Producto actualizado' : 'Producto creado');
        this.showForm = false;
        this.clearFilesUI();
        this.form = this.defaultForm();
        this.resetNgForm(this.form);
        this.fetch(1);
      },
      () => {
        this.loading = false; // reactivar botón si falla
        this.notify.toastError('No fue posible guardar');
      },
      () => {}
    );
  }

  /** Elimina un producto seleccionado. */
  remove(p: Product) {
    if (!confirm('¿Eliminar producto?')) return;
    this.loading = true;
    this.api.delete$(p.id).subscribe(
      () => {
        this.notify.toastSuccess('Producto eliminado');
        this.fetch(this.page);
      },
      () => {
        this.notify.toastError('No fue posible eliminar');
        this.loading = false;
      },
      () => (this.loading = false)
    );
  }

  /** Devuelve el estado inicial del formulario de producto. */
  private defaultForm() {
    return { title: '', points: 0, stock: 0, category: '', description: '', sizesText: '' };
  }

  /** Reinicia el NgForm con valores por defecto. */
  private resetNgForm(preset: any) {
    if (this.formRef) {
      this.formRef.resetForm(preset);
    }
    this.clearFilesUI();
  }

  /** Limpia inputs y previsualizaciones de archivos. */
  private clearFilesUI() {
    this.files = [];
    this.previews = [];
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
