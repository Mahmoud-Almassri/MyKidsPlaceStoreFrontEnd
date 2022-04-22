import { Actions } from './../../../shared/global-variables/api-config';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Controllers } from 'src/shared/global-variables/api-config';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseService } from 'src/shared/services/base.service';
import { NotificationService } from 'src/shared/services/notification.service';
import { NgxGalleryComponent, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { environment } from 'src/environments/environment';
import { fakeProducts } from 'src/shared/global-variables/fake-data';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-product-form-add',
  templateUrl: './product-form-add.component.html',
  styleUrls: ['./product-form-add.component.scss']
})
export class ProductFormAddComponent implements OnInit {
  public categoryList;
  public subCategoryList;
  public itemsList;
  public salesList;
  public subCategoryIdParam: number;
  public itemImagesList: any[] = [];
  public itemImagesToAdd: FormData = new FormData();
  public setItemsList: any[] = [];
  public setIds: any[] = [];
  public setName = new FormControl();
  public category = new FormControl('', Validators.required);
  public setItems = new FormControl();
  public brandsList;
  public fileUpload: any;
  public isEdit = false;
  public galleryOptions: NgxGalleryOptions[];
  public galleryImages: NgxGalleryImage[];
  public accept = 'image/*';
  public imageUrl = environment.imagesUrl;
  public imageSasToken = environment.sasToken;
  public interval: NodeJS.Timer;

  @ViewChild(NgxGalleryComponent) ngxGalleryComponent;
  @ViewChild('allItemsList') allItemsList: MatSelect;

  public productForm = new FormGroup({
    id: new FormControl(0),
    subCategoryId: new FormControl({ value: '', disabled: true }, Validators.required),
    brandId: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, Validators.min(1)]),
    itemCount: new FormControl('', [Validators.required, Validators.min(1)]),
    isSet: new FormControl(false),
    saleId: new FormControl(''),
    title: new FormControl(''),
    setDto: new FormControl(''),
    gender: new FormControl('', Validators.required),
    status: new FormControl(1, Validators.required),
    itemOrder: new FormControl('', [Validators.min(1)]),
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
    this.fetchParams();
    this.initializeGalleryConfigs();
    this.getAllCategories();
    this.getAllBrands();
    this.getAllItems();
    this.getAllSales();
  }
  public startSimulator() {
    //this.interval = setInterval(() => {
    // this.onFakeImagesSelected();
    const randomProduct = fakeProducts[Math.floor(Math.random() * fakeProducts.length)];
    this.getProductFormControlByName('brandId').setValue(randomProduct.brandId);
    this.getProductFormControlByName('itemCount').setValue(randomProduct.itemCount);
    this.getProductFormControlByName('price').setValue(randomProduct.price);
    if (randomProduct.isSet) {
      this.getProductFormControlByName('isSet').setValue(randomProduct.isSet);
    }
    if (randomProduct.saleId) {
      this.getProductFormControlByName('saleId').setValue(randomProduct.saleId);
    }
    if (randomProduct.setItems) {
      if(randomProduct.setItems.length){
        this.setIds = randomProduct.setItems;
        setTimeout(() => {
          this.allItemsList.options.forEach(s => {
            //console.log(s)
            const item = this.setIds.find(x => x == s.value);
            if (item) {
              s.select();
              console.log(s,"selected");
            }
          });
        }, 2000);
      }
     
        
    }
    if (randomProduct.itemOrder) {
      this.getProductFormControlByName('itemOrder').setValue(randomProduct.itemOrder);
    }
    //this.submitForm();
    //this.stopSimulator();
    //  }, 5000);

  }


  public stopSimulator() {
    clearInterval(this.interval);
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
      !this.galleryImages.length ||
      (this.getProductFormControlByName('isSet').value == true && (!this.setIds.length)) ||
      !this.category.value
    ) {
      this.productForm.markAllAsTouched();
      /*  if (!this.setName.value) {
         this.setName.markAsTouched();
       } */
      if (!this.setIds.length) {
        this.setItems.markAsTouched();
      }
      if (!this.category.value) {
        this.category.markAsTouched();
      }
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const setDto = {
        setName: ' ',//this.setName.value,
        setitems: this.setIds
      }
      this.getProductFormControlByName('setDto').setValue(setDto);
      const productForm = this.productForm.value;
      this.baseService.postItem(Controllers.Item, Actions.PostItem, productForm).subscribe(response => {
        this.uploadItemImages(response.id);
      }, error => {
        console.log(error);
        if (error.status === 400) {
          this.notification.showNotification('Add Product Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Add Product Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }

  private uploadItemImages(itemId: number) {
    this.baseService.postItemImages(Controllers.Item, Actions.AddItemImages, itemId, this.itemImagesToAdd).subscribe(response => {
      this.notification.showNotification('Add Product', 'Product Added Successfully', 'success');
      this.resetForm();
      this.spinner.hide();
    }, error => {
      if (error.status === 400) {
        this.notification.showNotification('Add Product Failed', 'Uploaded files are invalid', 'error');
      }
      else {
        this.notification.showNotification('Add Product Failed', 'Something went wrong please contact system admin', 'error');
      }
      this.resetImages();
      this.spinner.hide();
    })
  }
  /* Reset Changable Form Fields */
  public resetForm() {
    this.getProductFormControlByName('brandId').reset();
    this.getProductFormControlByName('itemCount').reset();
    this.getProductFormControlByName('price').reset();
    this.getProductFormControlByName('isSet').setValue(false);
    this.getProductFormControlByName('saleId').reset();
    this.getProductFormControlByName('setDto').reset();
    this.getProductFormControlByName('itemOrder').reset();
    this.itemImagesToAdd = new FormData();
    this.setName.reset();
    this.setIds = [];
    this.galleryImages = [];
    this.setItemsList = [];
    this.setItems.reset();
    this.fileUpload = null;
    this.resetImages();
  }
  public resetImages() {
    this.itemImagesToAdd = new FormData();
    this.galleryImages = [];
    this.fileUpload = null;
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
      this.getProductFormControlByName('subCategoryId').enable();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }

  itemSelectionChange(event) {
    const originalItem = this.itemsList.find(x => x.id == event.value)
    const selectedItem = this.setItemsList.find(x => x.id == event.value)
    if (!selectedItem && event.selected) {
      this.setItemsList.push(originalItem);
      this.setIds.push(event.value);
    }
    if (selectedItem && !event.selected) {
      this.setItemsList = this.setItemsList.filter(x => x != originalItem);
      this.setIds = this.setIds.filter(x => x != event.value);
    }
  }

  public onImagesSelected() {
    this.spinner.show()
    this.fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    console.log(this.fileUpload);
    
    this.fileUpload.onchange = () => {
      for (let index = 0; index < this.fileUpload.files.length; index++) {
        const file = this.fileUpload.files[index];
        this.itemImagesToAdd.append('files', file);
        var imageToShow;
        let reader = new FileReader();
        reader.addEventListener("load", () => {
          imageToShow = reader.result;
          this.galleryImages.push({ big: imageToShow, medium: imageToShow, small: imageToShow });
        }, false);
        if (file) {
          imageToShow = reader.readAsDataURL(file);
        }
      }
    };
    this.spinner.hide();
    this.fileUpload.click();
  }
  public onFakeImagesSelected() {
    var blob = null;
    var xhr = new XMLHttpRequest();
    var fakearray = [1, 2, 3, 4, 5, 6, 7];
    xhr.open("GET", './assets/fakeImages/p1.jpeg');
    xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
    xhr.onload = () => {
      blob = xhr.response;//xhr.response is now a blob object
      var file = new File([blob], 'p1.jpeg', { type: 'image/jpeg', lastModified: Date.now() });
      console.log(file);
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
    xhr.send()
  }
  public removeImageFromGallery() {
    const imageIndex = this.ngxGalleryComponent.selectedIndex;
    const deltedImage = this.galleryImages[imageIndex];
    this.galleryImages = this.galleryImages.filter(image => image != deltedImage)
  }

  isSetChanged(event) {
    if (event.checked) {
      //this.setName.setValidators();
      this.setItems.setValidators(Validators.required);
    } else {
      this.setItemsList = [];
    }
  }
  public fetchParams() {
    this.route.params.subscribe(params => {
      this.category.setValue(Number(params.categoryId));
      this.getProductFormControlByName('gender').setValue(Number(params.genderId));
      this.getProductFormControlByName('subCategoryId').setValue(Number(params.subCategoryId));
      this.subCategoryIdParam = params.subCategoryId;
    });
  }
  check(checked: boolean): void {
    this.getProductFormControlByName('status').setValue(checked ? 1 : 2);
  }
}
