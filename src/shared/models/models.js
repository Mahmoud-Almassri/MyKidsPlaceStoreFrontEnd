"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Division = /** @class */ (function () {
    function Division() {
    }
    return Division;
}());
exports.Division = Division;
var DivisionSearchModel = /** @class */ (function () {
    function DivisionSearchModel(DivisionCategoryType, divisionCategoryId, sectorBudgetFlag) {
        this.divisionCategoryType = DivisionCategoryType;
        this.divisionCategoryId = divisionCategoryId;
        this.sectorBudgetFlag = sectorBudgetFlag;
    }
    return DivisionSearchModel;
}());
exports.DivisionSearchModel = DivisionSearchModel;
var Category = /** @class */ (function () {
    function Category() {
    }
    return Category;
}());
exports.Category = Category;
var CategorySearchModel = /** @class */ (function () {
    function CategorySearchModel(IsCalculatedData) {
        this.IsCalculatedData = IsCalculatedData;
    }
    return CategorySearchModel;
}());
exports.CategorySearchModel = CategorySearchModel;
var LineItem = /** @class */ (function () {
    function LineItem() {
    }
    return LineItem;
}());
exports.LineItem = LineItem;
var LineItemCategory = /** @class */ (function () {
    function LineItemCategory() {
    }
    return LineItemCategory;
}());
exports.LineItemCategory = LineItemCategory;
var LineItemCategorySearchModel = /** @class */ (function () {
    function LineItemCategorySearchModel(categoryId) {
        this.categoryId = categoryId;
    }
    return LineItemCategorySearchModel;
}());
exports.LineItemCategorySearchModel = LineItemCategorySearchModel;
var LineItemDivisionSearchModel = /** @class */ (function () {
    function LineItemDivisionSearchModel(divisionId, lineItemId) {
        this.divisionId = divisionId;
        this.lineItemId = lineItemId;
    }
    return LineItemDivisionSearchModel;
}());
exports.LineItemDivisionSearchModel = LineItemDivisionSearchModel;
var LineItemDivision = /** @class */ (function () {
    function LineItemDivision() {
    }
    return LineItemDivision;
}());
exports.LineItemDivision = LineItemDivision;
var DivisionCategory = /** @class */ (function () {
    function DivisionCategory() {
    }
    return DivisionCategory;
}());
exports.DivisionCategory = DivisionCategory;
var Equation = /** @class */ (function () {
    function Equation() {
    }
    return Equation;
}());
exports.Equation = Equation;
var EquationSearchModel = /** @class */ (function () {
    function EquationSearchModel(assignedCategoryId) {
        this.assignedCategoryId = assignedCategoryId;
    }
    return EquationSearchModel;
}());
exports.EquationSearchModel = EquationSearchModel;
var DivisionCategorySite = /** @class */ (function () {
    function DivisionCategorySite() {
    }
    return DivisionCategorySite;
}());
exports.DivisionCategorySite = DivisionCategorySite;
var DivisionCategorySiteSearchModel = /** @class */ (function () {
    function DivisionCategorySiteSearchModel(siteId) {
        this.siteId = siteId;
    }
    return DivisionCategorySiteSearchModel;
}());
exports.DivisionCategorySiteSearchModel = DivisionCategorySiteSearchModel;
var DepartmentMapping = /** @class */ (function () {
    function DepartmentMapping() {
    }
    return DepartmentMapping;
}());
exports.DepartmentMapping = DepartmentMapping;
var CommercialMapping = /** @class */ (function () {
    function CommercialMapping() {
    }
    return CommercialMapping;
}());
exports.CommercialMapping = CommercialMapping;
var Bumanager = /** @class */ (function () {
    function Bumanager() {
    }
    return Bumanager;
}());
exports.Bumanager = Bumanager;
var BumanagerSearchModel = /** @class */ (function () {
    function BumanagerSearchModel(isSectorBudgetAssign) {
        this.isSectorBudgetAssign = isSectorBudgetAssign;
    }
    return BumanagerSearchModel;
}());
exports.BumanagerSearchModel = BumanagerSearchModel;
var DivisionBudgetSearchModel = /** @class */ (function () {
    function DivisionBudgetSearchModel(budgetRequestId) {
        this.budgetRequestId = budgetRequestId;
    }
    return DivisionBudgetSearchModel;
}());
exports.DivisionBudgetSearchModel = DivisionBudgetSearchModel;
var Tasks = /** @class */ (function () {
    function Tasks() {
    }
    return Tasks;
}());
exports.Tasks = Tasks;
var Approvals = /** @class */ (function () {
    function Approvals() {
    }
    return Approvals;
}());
exports.Approvals = Approvals;
var DivisionBudget = /** @class */ (function () {
    function DivisionBudget() {
    }
    return DivisionBudget;
}());
exports.DivisionBudget = DivisionBudget;
var SectorBudget = /** @class */ (function () {
    function SectorBudget() {
    }
    return SectorBudget;
}());
exports.SectorBudget = SectorBudget;
var SectorBudgetSearchModel = /** @class */ (function () {
    function SectorBudgetSearchModel(budgetRequestId) {
        this.budgetRequestId = budgetRequestId;
    }
    return SectorBudgetSearchModel;
}());
exports.SectorBudgetSearchModel = SectorBudgetSearchModel;
var BumanagerLineItem = /** @class */ (function () {
    function BumanagerLineItem() {
    }
    return BumanagerLineItem;
}());
exports.BumanagerLineItem = BumanagerLineItem;
var BumanagerLineItemSearchModel = /** @class */ (function () {
    function BumanagerLineItemSearchModel(lineItemCategoryId) {
        this.lineItemCategoryId = lineItemCategoryId;
    }
    return BumanagerLineItemSearchModel;
}());
exports.BumanagerLineItemSearchModel = BumanagerLineItemSearchModel;
//# sourceMappingURL=models.js.map