import Vue, { ComponentOptions } from "vue";

declare module "vue/types/options" {
  interface ComponentOptions<
    V extends Vue,
    Data = DefaultData<V>,
    Methods = DefaultMethods<V>,
    Computed = DefaultComputed,
    PropsDef = PropsDefinition<DefaultProps>,
    Props = DefaultProps
  > {
    head?: object | Function;
    layout?: string | Function;
    middleware?: string | string[] | object;
    scrollToTop?: boolean;
    transition?: String | object | Function;
    watchQuery?: boolean | string[];
  }
}

interface apiService {
  index: Function;
  show: Function;
  delete: Function;
  create: Function;
  update: Function;
  query: Function;
  //  (query: object): Promise<any>
}

declare module "vue/types/vue" {
  interface Vue {
    $registerApi: apiService;
    $countriesApi: apiService;
    $propertyTypesApi: apiService;
    $listingPlansApi: apiService;
    $listingApi: apiService;
    $listingCategoriesApi: apiService;
    $listingImagesApi: apiService;
    $forgottenPassApi: apiService;
    $socialloginApi: apiService;
    $listingSpecificationApi: apiService;
    $listingAmenitiesApi: apiService;
    $listingOtherSpecificationApi: apiService;
    $selectFavoriteApi: apiService;
    $similarListingsApi: apiService;
    $userApi: apiService;
    $passwordApi: apiService;
    $userUpdateApi: apiService;
    $querySearchApi: apiService;
    $discountApi: apiService;
    $SelectdPlanApi: apiService;
    $userFavoriteApi: apiService;
    $propertySpecApi: apiService;
    $propertyAmenitiesApi: apiService;
    $filterPropertiesApi: apiService;
    $socialregisterApi: apiService;
    $router: any;
    $auth: any;
    $alert: any;
    $confirm: any;
    // $refs: { [key: string]: Vue | Element | (Vue | Element)[] | Function | undefined; }
  }
}
