export const errorMessages = [
    {id: 1, name: 'LoginPasswordWrong', messageEn: 'Username or password is wrong', messageAr: 'اسم المستخدم او الرقم السري خاطئة'},
    {id: 2, name: 'MobileNumberIsUsed', messageEn: 'Mobile number is used', messageAr: 'رقم الهاتف مستخدم'},
    {id: 3, name: 'ErrorCreatingAccount', messageEn: 'Error creating account', messageAr: 'خطا في تسجيل حساب جديد'},
    {id: 4, name: 'ErrorUpdatingAccount', messageEn: 'Error updating account', messageAr: 'خطا في تعديل الحساب'},
    {id: 5, name: 'UserNotFound', messageEn: 'User not found', messageAr: 'المستخدم غير موجود'},
    {id: 6, name: 'ItemCountNotEnough', messageEn: 'Item count is not enough', messageAr: 'الكمية غير كافية لتنفيذ طلبك'},
    {id: 7, name: 'UserCartNotFound', messageEn: 'You don\'t have a cart, please contact system admin to add one', messageAr: 'لا يوجد لديك سلة، يرجى التواصل مع الادارة لاضافة واحدة'},
    {id: 8, name: 'CartIsEmpty', messageEn: 'Cart is empty', messageAr: 'السلة فارغة'},
    {id: 9, name: 'ItemNotAvailable', messageEn: 'Item is not available', messageAr: 'المنتج غير متوفر حاليا'},
    {id: 10, name: 'ItemAlreadyExist', messageEn: 'Item is already exist in cart', messageAr: 'المنتج موجود بالفعل في السلة'}
];

export enum ErrorMessages
{
    LoginPasswordWrong = 1,
    MobileNumberIsUsed = 2,
    ErrorCreatingAccount = 3,
    ErrorUpdatingAccount = 4,
    UserNotFound = 5,
    ItemCountNotEnough = 6,
    UserCartNotFound = 7,
    CartIsEmpty = 8,
    ItemNotAvailable = 9,
    ItemAlreadyExist = 10
}