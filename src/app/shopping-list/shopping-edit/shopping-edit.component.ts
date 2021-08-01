import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', {static: false}) form: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe((id) => {
      this.editedItemIndex = id;
      this.editMode = true;
      this.editedItem = this.slService.getIngredient(id);
      this.form.form.setValue({
        'name': this.editedItem.name,
        'amount': this.editedItem.amount
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    const ing = new Ingredient(this.form.value.name, this.form.value.amount);
    if (this.editMode) {
      this.slService.updateIngredient(this.editedItemIndex, ing);
    } else {
      this.slService.addIngredient(ing);
    }
    this.editMode = false;
    this.form.reset();
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  onClear() {
    this.form.reset();
    this.editMode = false;
  }
}
