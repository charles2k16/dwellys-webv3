import createApi from '~/api/apiService';

export default (ctx, inject) => {
  // inject the repository in the context (ctx.app.$repository)
  // And in the Vue instances (this.$repository in your components)

  const apiService = createApi(ctx.$axios);

  // You can reuse the repositoryWithAxios object:
  inject('registerApi', apiService('/signup'));
  inject('socialregisterApi', apiService('/signupwithsocialmedia'));
  inject('socialloginApi', apiService('/loginwithsocialmedia'));
  inject('countriesApi', apiService('/countries'));
  inject('propertyTypesApi', apiService('/propertytypes'));
  inject('listingPlansApi', apiService('/listingplans'));
  inject('listingSpecificationApi', apiService('/listingspecifications'));
  inject('listingAmenitiesApi', apiService('/listingamenities'));
  inject(
    'listingOtherSpecificationApi',
    apiService('/listingotherspecifications')
  );
  inject('listingApi', apiService('/listings'));
  inject(
    'similarListingsApi',
    apiService('/similarlistings?property_type_name=')
  );

  inject('listingImagesApi', apiService('/listingimages'));
  inject('listingCategoriesApi', apiService('/listingcategories'));
  inject('forgottenPassApi', apiService('/forgotpassword'));
  inject('selectFavoriteApi', apiService('/toggleuserfavoritelisting'));
  inject('userApi', apiService('/users'));
  inject('userUpdateApi', apiService('/auth/account'));
  inject('passwordApi', apiService('/updatepassword'));
  inject('discountApi', apiService('/discounts'));
  inject('verifydiscountApi', apiService('/verifydiscount?discount_code='));
  inject('SelectdPlanApi', apiService('/listingselectedplans'));
  inject('userFavoriteApi', apiService('/myfavoritelisting'));
  inject('querySearchApi', apiService('/searchlisting?search_query='));
  inject('propertySpecApi', apiService('/propertytypespecifications'));
  inject('propertyAmenitiesApi', apiService('/propertytypeamenities'));
  inject(
    'filterPropertiesApi',
    apiService('/filterlistings?status=active&property_type_name=')
  );
  inject(
    'searchProperties',
    apiService('/filterlistingsthroughsearchcriteria?')
  );
};
