import { Actions } from '../../../shared/global-variables/api-config';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Controllers } from 'src/shared/global-variables/api-config';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthorizeService } from 'src/auth/authorize.service';
import { BaseService } from 'src/shared/services/base.service';
import { NotificationService } from 'src/shared/services/notification.service';
import { NgxGalleryComponent, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { MatSelect } from '@angular/material/select';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, AfterViewInit {
  public categoryList;
  public subCategoryList;
  public itemsList;
  public salesList;
  public itemImagesList: any[] = [];
  public itemImagesToAdd: FormData = new FormData();
  public setItemsList: any[] = [];
  public originalSetItemsList: any[] = [];
  public setIds: any[] = [];
  //public setName = new FormControl();
  public setItems = new FormControl();
  public brandsList;
  public itemId: number;
  public item: any;
  public isEdit = false;
  public isUpdateMode: boolean;
  public galleryOptions: NgxGalleryOptions[];
  public galleryImages: NgxGalleryImage[];
  public accept = 'image/*';
  @ViewChild(NgxGalleryComponent) ngxGalleryComponent;
  @ViewChild('allItemsList') allItemsList: MatSelect;
  public imageUrl = environment.imagesUrl;
  public imageSasToken = environment.sasToken;
  public subCategoryIdParam: number;

  public productForm = new FormGroup({
    id: new FormControl(0),
    subCategoryId: new FormControl({ value: '', disabled: true }, Validators.required),
    categoryId: new FormControl({ value: '', disabled: true }),
    brandId: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, Validators.min(1)]),
    itemCount: new FormControl('', [Validators.required, Validators.min(1)]),
    isSet: new FormControl(''),
    setId: new FormControl(''),
    saleId: new FormControl(''),
    setDto: new FormControl(''),
    title: new FormControl(''),
    gender: new FormControl({ value: '', disabled: true }, Validators.required),
    status: new FormControl('', Validators.required),
    itemOrder: new FormControl(''),
  });

  constructor(
    private baseService: BaseService,
    public spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    public notification: NotificationService
  ) { }

  getProductFormControlByName(controlName): FormControl {
    return this.productForm.get(controlName) as FormControl;
  }

  ngOnInit(): void {
    this.getItemById();
    this.initializeGalleryConfigs();
    this.getAllCategories();
    this.getAllBrands();
    this.getAllSales();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log(this.allItemsList)
      console.log(this.setItemsList)

    }, 1000);
  }
  public getItemById() {
    this.route.params.subscribe(params => {
      this.itemId = params.itemId;
      var stringValue = params.isUpdateMode;
      this.isUpdateMode = (stringValue == "true");
      if (this.isUpdateMode == false) {
        this.productForm.disable();
        //this.setName.disable();
        this.setItems.disable();
      }
      this.baseService.getByIdWithRelated(Controllers.Item, params.itemId).subscribe(response => {
        this.item = response;
        this.subCategoryIdParam = this.item.subCategoryId;
        this.getAllItems();
        if (this.item.isSet) {
          //this.setName.setValidators(Validators.required)
          this.setItems.setValidators(Validators.required)
          if (this.item.set) {
            //this.setName.setValue(this.item.set.setName)

          }
        } else {
          //this.setName.setValue('')
        }
        this.productForm.patchValue(response);
        this.getProductFormControlByName('categoryId').setValue(response.subCategory.categoryId);
        this.fetchItemImages(response.itemImages);
      })
    })
  }
  public enableUpdateMode() {
    //this.productForm.enable();
    this.getProductFormControlByName('price').enable();
    this.getProductFormControlByName('brandId').enable();
    this.getProductFormControlByName('itemCount').enable();
    this.getProductFormControlByName('itemOrder').enable();
    this.getProductFormControlByName('saleId').enable();
    this.getProductFormControlByName('isSet').enable();
    this.getProductFormControlByName('status').enable();
    this.isUpdateMode = true;
    //this.setName.enable();
    this.setItems.enable();
    this.ngAfterViewInit();
  }
  public initializeGalleryConfigs() {
    this.galleryOptions = [
      {
        width: '1000px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: 'auto',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];

    this.galleryImages = [];
  }
  submitForm(): void {
    if (this.productForm.invalid ||
      (this.getProductFormControlByName('isSet').value == true &&
        (!this.setIds.length))) {
      this.productForm.markAllAsTouched();
      /*  if (!this.setName.value) {
         this.setName.markAsTouched();
       } */
      if (!this.setIds.length) {
        this.setItems.markAsTouched();
      }
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const setDto = {
        setName: '',//this.setName.value,
        setitems: this.setIds
      }
      this.getProductFormControlByName('setDto').setValue(setDto);
      const productForm = this.productForm.getRawValue();
      this.baseService.editItem(Controllers.Item, productForm).subscribe(response => {
        this.uploadItemImages();
      }, error => {
        console.log(error);
        if (error.status === 400) {
          this.notification.showNotification('Update Product Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Update Product Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }
  public checkIfItemExistInSetItems(itemId) {
    const item = this.setItemsList.find(x => x.id == itemId);
    if (item) {
      return true;
    }
    return false;
  }
  private uploadItemImages() {
    this.baseService.postItemImages(Controllers.Item, Actions.AddItemImages, this.itemId, this.itemImagesToAdd).subscribe(response => {
      this.notification.showNotification('Update Product', 'Product Updated Successfully', 'success');
      this.spinner.hide();
    }, error => {
      if (error.status === 400) {
        this.notification.showNotification('Add Product Failed', 'Uploaded files are invalid', 'error');
      }
      else {
        this.notification.showNotification('Update Product Failed', 'Something went wrong please contact system admin', 'error');
      }
      this.spinner.hide();
    })
  }
  /* Get Lookups */
  getAllCategories(): void {
    this.spinner.show();
    const Controller = Controllers.Category;
    this.baseService.getAllItems(Controller).subscribe(res => {
      this.categoryList = res;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }

  getAllBrands(): void {
    this.spinner.show();
    const Controller = Controllers.Brand;
    this.baseService.getAllItems(Controller).subscribe(res => {
      this.brandsList = res;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }
  getAllItems(): void {
    this.spinner.show();
    const Controller = Controllers.Item;
    this.baseService.getAllItemsWithImages(Controller, this.subCategoryIdParam).subscribe(res => {
      this.itemsList = res;
      this.spinner.hide();
      this.getAllSetItems();
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }
  getAllSetItems(): void {
    this.spinner.show();
    const Controller = Controllers.Item;
    this.baseService.getItemsBySetId(Controller, this.item.setId).subscribe(res => {
      this.setItemsList = res;
      this.setItemsList.forEach(item => {
        this.setIds.push(item.id)
        this.originalSetItemsList.push(item.id);
      });
      if (this.allItemsList) {
        this.allItemsList.options.forEach(s => {
          const item = this.setItemsList.find(x => x.id == s.value);
          if (item) {
            s.select();
          }
        });
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }
  getAllSales(): void {
    this.spinner.show();
    const Controller = Controllers.Sale;
    this.baseService.getAllItems(Controller).subscribe(res => {
      this.salesList = res;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }
  getSubCategoryByCategories(categoryId: number): void {
    this.spinner.show();
    const Controller = Controllers.SubCategory;
    this.baseService.getByParentId(Controller, categoryId).subscribe(res => {
      this.subCategoryList = res;

      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }
  public deleteSetItem(itemId: number) {
    const isItemExist = this.originalSetItemsList.find(x => x == itemId);
    if (isItemExist) {
      this.baseService.deleteSetItem(itemId).subscribe(res => {
        console.log('set item deleted');
      }, error => {

      });
    }
  }
  itemSelectionChange(event) {
    console.log(event);
    if (!event.selected) {
      this.deleteSetItem(event.value);
    }
    const originalItem = this.itemsList.find(x => x.id == event.value)
    const selectedItem = this.setItemsList.find(x => x.id == event.value)
    if (!selectedItem && event.selected) {
      console.log(originalItem);
      this.setItemsList.push(originalItem);
      this.setIds.push(event.value);
    }
    if (selectedItem && !event.selected) {
      this.setItemsList = this.setItemsList.filter(x => x.id != event.value);
      this.setIds = this.setIds.filter(x => x != event.value);
    }
  }

  public onImagesSelected() {
    this.spinner.show()
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.itemImagesToAdd.append('files', file);
        var imageToShow;
        let reader = new FileReader();
        reader.addEventListener("load", () => {
          imageToShow = reader.result;
          this.galleryImages.push({ big: imageToShow, medium: imageToShow, small: imageToShow });
          this.spinner.hide();
        }, false);
        if (file) {
          imageToShow = reader.readAsDataURL(file);
          this.spinner.hide();
        }
      }
    };
    fileUpload.click();
  }
  fetchItemImages(itemImages: any[]) {

    itemImages.forEach(image => {
      this.galleryImages.push({
        label: image.id,
        big: this.imageUrl + image.imagePath+this.imageSasToken,
        medium: this.imageUrl + image.imagePath+this.imageSasToken,
        small: this.imageUrl + image.imagePath+this.imageSasToken
      });
    });
  }

  public removeImageFromGallery() {
    const imageId = this.ngxGalleryComponent.labels[this.ngxGalleryComponent.selectedIndex];
    this.baseService.removeItemImage(Controllers.Item, Number(imageId)).subscribe(res => {
      const imageIndex = this.ngxGalleryComponent.selectedIndex;
      const deltedImage = this.galleryImages[imageIndex];
      this.galleryImages = this.galleryImages.filter(image => image != deltedImage)
    });
  }

  isSetChanged(event) {
    if (event.checked) {
      //this.setName.setValidators(Validators.required)
      this.setItems.setValidators(Validators.required)
    } else {
      this.setItemsList = [];
    }
  }
  check(checked: boolean): void {
    this.getProductFormControlByName('status').setValue(checked ? 1 : 2);
  }
  public getDefaultItemImage(itemImages) {

    const defaultImage = itemImages.find(x => x.isDefault);
    const defaultFirstImage = itemImages[0].imagePath;
    if (defaultImage) {
      return defaultImage.imagePath;
    }
    else {
      return defaultFirstImage;
    }
  }
  public getDefaultSelectedItemImage(itemImages) {
    if (!itemImages.length) {
      return '../../assets/Images/logo.png';
    }
    const defaultImage = itemImages[0];
    const defaultFirstImage = itemImages[0].imagePath;
    if (defaultImage) {
      return this.imageUrl + defaultImage.imagePath;
    }
    else {
      return defaultFirstImage;
    }
  }
}
