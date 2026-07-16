import {
  Component,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { combineLatest, forkJoin, interval, Subject, take, takeUntil } from 'rxjs';
import { FormGroup, Validators } from '@angular/forms';
import { apiEndPoints } from '../service/api-service/api-endpoints.constant';
import { ApiService } from '../service/api-service/api.service';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SharedModule } from '../common/shared.module';
import { CartSubmissionComponent } from '../cart-submission/cart-submission.component';
import { MaterialInformationComponent } from '../material-information/material-information.component';
import { PimpBlogDescriptionComponent } from '../pimp-blog-description/pimp-blog-description.component';
import { CartItemsList } from '../cart-items-list/cart-items-list';

@Component({
  selector: 'app-master-data-management',
  templateUrl: './master-data-management.component.html',
  styleUrls: ['./master-data-management.component.scss'],
  standalone: true,
  imports: [AngularMaterialModule, CommonModule, SharedModule, FormsModule]
})
export class MasterDataManagementComponent implements OnDestroy {
  //   medicineCards=[
  //   { "title": "Aspirin", "content": "Used to reduce pain, fever, or inflammation" },
  //   { "title": "Amoxicillin", "content": "Antibiotic for bacterial infections" },
  //   { "title": "Atorvastatin", "content": "Used to lower cholesterol" },
  //   { "title": "Azithromycin", "content": "Antibiotic for infections" },
  //   { "title": "Alprazolam", "content": "Used for anxiety disorders" },
  //   { "title": "Acetaminophen", "content": "Pain reliever and fever reducer" },
  //   { "title": "Amlodipine", "content": "Used for high blood pressure" },
  //   { "title": "Allopurinol", "content": "Used to treat gout" },
  //   { "title": "Amiodarone", "content": "Used to treat heart rhythm problems" },
  //   { "title": "Anastrozole", "content": "Used in breast cancer treatment" },
  //   { "title": "Azathioprine", "content": "Used for autoimmune diseases" },
  //   { "title": "Acetazolamide", "content": "Used to treat glaucoma" },
  //   { "title": "Alendronate", "content": "Used for osteoporosis" },
  //   { "title": "Aripiprazole", "content": "Used for schizophrenia and bipolar disorder" },
  //   { "title": "Atenolol", "content": "Used for high blood pressure" },
  //   { "title": "Ampicillin", "content": "Antibiotic for infections" },
  //   { "title": "Amantadine", "content": "Used for Parkinson’s disease and flu" },
  //   { "title": "Azelastine", "content": "Used for allergies" },
  //   { "title": "Acrivastine", "content": "Antihistamine for allergies" },
  //   { "title": "Albendazole", "content": "Used to treat parasitic worm infections" },
  //   { "title": "Acrivastine-D", "content": "Combination for allergy relief" },
  //   { "title": "Acebutolol", "content": "Used for heart rhythm disorders" },
  //   { "title": "Aliskiren", "content": "Used for high blood pressure" },
  //   { "title": "Anagrelide", "content": "Used to treat blood platelet disorders" },
  //   { "title": "Amifostine", "content": "Used to reduce side effects of chemotherapy" },
  //   { "title": "Apixaban", "content": "Used to prevent blood clots" },
  //   { "title": "Adefovir", "content": "Used to treat hepatitis B" },
  //   { "title": "Armodafinil", "content": "Used to treat sleep disorders" },
  //   { "title": "Albuterol", "content": "Used for asthma and breathing problems" },
  //   { "title": "Aztreonam", "content": "Antibiotic for bacterial infections" }
  // ]
  @ViewChild(MatPaginator) paginator: MatPaginator;
  showAlphabetSection = false;
  public medicineCards: any[] = [];
  public filteredMedicineCards: any[] = [];
  public selectedMedicine: any = null;
  alphabets: string[] = [];
  isGridView = false;
  scrollTextData: any;
  materialInfoData: any;
  packNumber: any;
  totals: any = {
    ff0012: 0,
    ff0013: 0,
    ff0014: 0,
    ff0015: 0,
    ff0016: 0,
    ff0017: 0,
  };
  public $destroy = new Subject();

  setView(view: string): void {
    this.isGridView = view === 'grid';
  }
  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    public dialog: MatDialog,
  ) { }
  ngAfterViewInit() {
    this.getTopSlider();
    this.getInputData();
    this.scrollText();
    // this.blogList();
    this.buttonBarLabelText();
    this.ClientLogoImage();
    window.scrollTo(0, 0);
  }
  getInputData() {
    let unitCode = "PM1";
    let params = { unitCode };
    let HttpMethod = 'GET';
    this.apiService
      .sendRequest(apiEndPoints.pimrInputData, HttpMethod, params)
      .subscribe((response: any) => {
        console.log(response.data?.bgimpLsList[0].bgiCode);
        if (response.data?.bgimpLsList[0].bgiCode) {
          this.leftPanelImage(response.data?.bgimpLsList[0].bgiCode);
        }
        if (response.data?.bgimpRsList[0].bgiCode) {
          this.RightPanelImage(response.data?.bgimpRsList[0].bgiCode);
        }
      });
  }
  leftPanelSlides: any;
  leftPanelImage(bgiCode: string) {
    let unitCode = "PM1"
    const params = { uc0001: bgiCode, ff0001: 'LS', unitCode: unitCode };
    const HttpMethod = 'GET';

    this.apiService
      .sendRequest(apiEndPoints.pimlhimage, HttpMethod, params)
      .subscribe((response: any) => {
        if (response.data && Array.isArray(response.data)) {
          this.leftPanelSlides = response.data.map((item) => ({
            image: 'data:image/png;base64,' + item.image,
          }));
          interval(2000)
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => {
              if (this.leftPanelSlides.length > 0) {
                this.currentLeftSlideIndex =
                  (this.currentLeftSlideIndex + 1) % this.leftPanelSlides.length;
              }
            });
        } else {
          console.error('No left panel image data available');
        }
      });
  }
  currentLeftSlideIndex = 0;

  changeLeftSlide(step: number) {
    this.currentLeftSlideIndex =
      (this.currentLeftSlideIndex + step + this.leftPanelSlides.length) %
      this.leftPanelSlides.length;
  }
  currentLeftSlide(index: number) {
    this.currentLeftSlideIndex = index;
  }
  rightPanelSlides: any;
  RightPanelImage(bgiCode: string) {
    let unitCode = "PM1"
    const params = { uc0001: bgiCode, ff0001: 'RS', unitCode: unitCode };
    const HttpMethod = 'GET';

    this.apiService
      .sendRequest(apiEndPoints.pimrhimage, HttpMethod, params)
      .subscribe((response: any) => {
        if (response.data && Array.isArray(response.data)) {
          this.rightPanelSlides = response.data.map((item) => ({
            image: 'data:image/png;base64,' + item.image,
          }));
          interval(2000)
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => {
              if (this.rightPanelSlides.length > 0) {
                this.currentRightSlideIndex =
                  (this.currentRightSlideIndex + 1) % this.rightPanelSlides.length;
              }
            });
        } else {
          console.error('No right panel image data available');
        }
      });
  }
  currentRightSlideIndex = 0;

  currentRightSlide(index: number) {
    this.currentRightSlideIndex = index;
  }

  sliderData: any;
  getTopSlider() {
    let unitCode = "PM1"
    let ff0001 = 'TOP';
    let params = { ff0001, unitCode };
    let HttpMethod = 'GET';

    this.apiService
      .sendRequest(apiEndPoints.pimrTopImage, HttpMethod, params)
      .subscribe((response: any) => {
        if (response.data && Array.isArray(response.data)) {
          this.slides = response.data.map((item) => ({
            image: 'data:image/png;base64,' + item.image,
          }));
          // 🔁 Start auto-slide every 2 seconds
          interval(2000)
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => {
              if (this.slides.length > 0) {
                this.currentSlideIndex =
                  (this.currentSlideIndex + 1) % this.slides.length;
              }
            });
        } else {
          console.error('No slider data available');
        }
      });
  }

  slides = [];

  currentSlideIndex = 0; // Initialize to show the first slide

  plusSlides(n: number) {
    this.currentSlideIndex =
      (this.currentSlideIndex + n + this.slides.length) % this.slides.length;
  }

  currentSlide(index: number) {
    this.currentSlideIndex = index;
  }

  blogPosts = [];

  //Client logo
  pageIndex = 0;
  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadPaginatedData();
  }
  paginatedBlogPosts: any[] = [];
  loadPaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedBlogPosts = this.blogPosts.slice(startIndex, endIndex);
  }
  totalPosts: any;
  pageSize = 5;
  blogList(buttonValue: any) {
    console.log(buttonValue);
    const params = { ff0011: buttonValue };
    const HttpMethod = 'GET';

    this.apiService
      .sendRequest(apiEndPoints.pimrBlogList, HttpMethod, params)
      .subscribe((response: any) => {
        console.log(response);
        console.log(response.data[0]?.ff0002);
        this.packNumber = response?.data[0]?.ff0002;
        this.totalPosts = response.data?.length;
        console.log(this.totalPosts);
        this.blogPosts = response.data?.map((item) => ({
          uc0001: item.uc0001,
          image: 'data:image/png;base64,' + item.image,
          title: item.ff0012,
          content: item.ff0003,
          meta: 'Monograph Status ' + item.ff0014,
        }));
        this.loadPaginatedData();
      });
  }
  public onSelectMedicine(card: any) {
    this.selectedMedicine = card;
    const params = { ff0002: card.uc0001 };
    const HttpMethod = 'GET';
    this.apiService
      .sendRequest(apiEndPoints.pimpMedicineList, HttpMethod, params)
      .subscribe((response: any) => {
        this.packNumber = response?.data[0]?.ff0002;
        this.totalPosts = response.data?.length;
        this.blogPosts = response.data.map((item) => ({
          uc0001: item.uc0001,
          image: 'data:image/png;base64,' + item.image,
          title: item.ff0012,
          content: item.ff0003,
          meta: 'Monograph Status ' + item.ff0014,
        }));
        this.loadPaginatedData();
      });
  }
  clients = [
    { logo: 'assets/logos/casper.png', name: 'Client 1' },
    { logo: 'assets/logos/cronus.png', name: 'Client 2' },
    { logo: 'assets/logos/hetero.png', name: 'Client 3' },
    { logo: 'assets/logos/rqp.png', name: 'Client 4' },
    { logo: 'assets/logos/Saanso.png', name: 'Client 5' },
    { logo: 'assets/logos/suven.png', name: 'Client 6' },
  ];

  //Client logo
  clientLogoList: any;
  ClientLogoImage() {
    let unitCode = "PM1"
    const params = { ff0001: unitCode };
    const HttpMethod = 'GET';

    this.apiService
      .sendRequest(apiEndPoints.pimrClientLogoList, HttpMethod, params)
      .subscribe((response: any) => {
        if (response.data && Array.isArray(response.data)) {
          this.clientLogoList = response.data.map((item) => ({
            image: 'data:image/png;base64,' + item.image,
          }));
        } else {
          console.error('No right panel image data available');
        }
      });
  }

  scrollText() {
    const params = { uc0001: 'SP1S001' };
    const HttpMethod = 'GET';

    this.apiService
      .sendRequest(apiEndPoints.pimrScrollText, HttpMethod, params)
      .subscribe((response: any) => {
        if (response.data) {
          this.scrollTextData = response.data[0].ff0001;
        } else {
          this.scrollTextData = 'Latest Alert! comming soon.';
        }
      });
  }
  //button
  buttonBarList: any;
  buttonBarLabelText() {
    const params = {};
    const HttpMethod = 'GET';

    this.apiService
      .sendRequest(apiEndPoints.blagButtonsList, HttpMethod, params)
      .subscribe((response: any) => {
        if (response.data) {
          this.buttonBarList = response.data.mattList;
          response.data.mattList.forEach((element) => {
            this.buttons.push(element.mattNumber);
          });
          this.blogList(this.buttonBarList[0].mattName);
        } else {
          this.buttons = [
            'Quality Assurance',
            'Quality Control',
            'Production',
            'Engineering',
            'Microbiology',
          ];
        }
      });
  }
  // New button array
  buttons = [];

  onLoadDescription(uc0001: any) {
    const dialogRef = this.dialog.open(PimpBlogDescriptionComponent, {
      minWidth: '80%',
      data: { uc0001: uc0001, type: 'blogDescription' },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }
  onLoadDescription2() {
    const dialogRef = this.dialog.open(PimpBlogDescriptionComponent, {
      minWidth: '80%',
      data: { uc0001: this.packNumber.uc0001, type: 'cart' },
    });
    dialogRef.afterClosed().subscribe((result) => { 
      if (result?.verified) {
      this.cart();
    }
    });
  }

  public materialInfo(data: any, index: any): void {
    console.log(data);
    const pack = this.apiService.packList(data.uc0001);
    const materialInfo = this.apiService.materialInfo(data.uc0001);

    forkJoin([pack, materialInfo]).subscribe(
      ([{ data }, materialInfoResult]) => {
        // Now you can access the results
        if (data && materialInfoResult) {
          materialInfoResult = materialInfoResult.data.map((element) => ({
            ...element,
            image: 'data:image/png;base64,' + element.image,
          }));
          const dialogRef = this.dialog.open(MaterialInformationComponent, {
            // minWidth: '80%',
            // height: '500px',
            width: '1200px',
            minWidth: '80vw',
            maxWidth: '90vw',
            height: '80vh',
            maxHeight: '80vh',
            data: {
              materialInfo: materialInfoResult,
              pack: data,
              uc0001: data.uc0001,
            },
          });

          dialogRef.afterClosed().subscribe((result) => result);
        }
      }
    );
    // this.apiService.packList(data.uc0001).subscribe((data) => {});
  }
  // onButtonClick(button: any) {
  //   console.log(button);
  //   this.buttonBarList.forEach((ele) => {
  //     if (ele.mattNumber == button) {
  //       let buttonValue = ele.mattName;
  //       this.blogList(buttonValue);
  //     }
  //   });
  // }
  selectedButton: string | null = null;
  selectedAlphabet: string | null = null; // Track selected alphabet

  // Scroll button click
  showMedicineGrid = false;
  onButtonClick(button: any) {
    this.selectedButton = button; // track active scroll button
    this.selectedAlphabet = null; // clear any alphabet selection
    console.log(button);
    this.buttonBarList.forEach((ele) => {
      if (ele.mattNumber == button) {
        let buttonValue = ele.mattName;
        this.blogList(buttonValue);

        // Show A–Z alphabets when a button is clicked
        this.showAlphabetSection = true;
        this.alphabets = Array.from({ length: 26 }, (_, i) =>
          String.fromCharCode(65 + i)
        );
      }
    });
  }

  // Alphabet button click
  // onAlphabetClick(letter: string) {
  //    this.showMedicineGrid = true;
  //   this.selectedAlphabet = letter; // track active alphabet
  //    this.medicineCards = this.medicineCards.filter((card) =>
  //       card.title.toUpperCase().startsWith(letter)
  //     );
  // }
  // Add this property
  // filteredMedicineCards = [...this.medicineCards];

  // Update onAlphabetClick to also update filteredMedicineCards
  // onAlphabetClick(letter: string) {
  //   console.log(letter)
  //   this.selectedAlphabet = letter;
  //   this.showMedicineGrid = true;

  //   this.filteredMedicineCards = this.medicineCards.filter(card =>
  //     card.title.toUpperCase().startsWith(letter)
  //   );

  //   // Clear search term
  //   this.searchTerm = '';
  // }

  searchTerm: string = '';
  onAlphabetClick(letter: string) {
    this.selectedAlphabet = letter;
    this.showMedicineGrid = true;
    const HttpMethod = 'GET';
    let ff0002 = this.selectedAlphabet;
    let ff0003 = 'API';
    const params = { ff0002, ff0003 };
    this.apiService
      .sendRequest(apiEndPoints.pimpMaterialList, HttpMethod, params)
      .subscribe((response: any) => {
        this.medicineCards = response.data;
        this.filteredMedicineCards = this.medicineCards;
        this.filteredMedicineCards = this.medicineCards.filter(card =>
          card.ff0001.toUpperCase().startsWith(letter)
        );
        // Clear search term
        this.searchTerm = '';
      });
  }

  // New search method
  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredMedicineCards = this.medicineCards.filter(card =>
      card.title.toLowerCase().includes(term)
    );
    // If alphabet is selected, further filter by it
    if (this.selectedAlphabet) {
      this.filteredMedicineCards = this.filteredMedicineCards.filter(card =>
        card.title.toUpperCase().startsWith(this.selectedAlphabet)
      );
    }
  }

  callAlphabetApi(letter: string) {
    this.selectedAlphabet = letter;
    // Replace with your actual API call logic
    console.log(`API called for: ${letter}`);
  }
  isCartActive = false;
  public cart(): void {
    this.isCartActive = true;

 const dialogRef = this.dialog.open(PimpBlogDescriptionComponent, {
    minWidth: '500px',
    disableClose: true,
    data: {
      type: 'cart'
    }
  });
 dialogRef.afterClosed().subscribe((result) => {
   if (!result?.verified) {
    this.isCartActive = false;
    return;
  }
    const unitCode = "PM1"
    const getInInfo = this.apiService.getVenInfo(unitCode, 0, 100);

    forkJoin([getInInfo.pipe(take(1))])
      .pipe(takeUntil(this.$destroy))
      .subscribe(([venInfo]) => {
        if (venInfo) {
          // const dialogRef = this.dialog.open(CartSubmissionComponent, {
          //   width: '1500px',
          // height: '800px',
           const dialogRef = this.dialog.open(CartItemsList, {
            width: '500px',
          height: '500px',
          data: {
            venInfo: venInfo?.data?.content,
            totals: this.totals,

            // Pass OTP verified email
            gmail: result.mail
          }
          });

          // ✅ now dialogRef is defined, we can subscribe
          dialogRef.afterClosed().subscribe(() => {
            this.isCartActive = false; // remove highlight after dialog closes
          });
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }


}
