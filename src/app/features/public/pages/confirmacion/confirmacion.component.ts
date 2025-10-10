import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.css']
})
export class ConfirmacionComponent implements OnInit {
  ordenId = '';
  constructor(private route: ActivatedRoute, private router: Router) {}
  /** Lee el ID de la orden desde la ruta. */
  ngOnInit(): void {
    this.ordenId = this.route.snapshot.paramMap.get('id') || '';
  }
}

