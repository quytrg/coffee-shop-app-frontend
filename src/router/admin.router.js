import systemConfig from '@/config/system/index.js'
import AdminLayout from '@/views/admin/layouts/default.vue'
import ProductsAdmin from '@/views/admin/pages/Products/Products.vue'
import Dashboard from '@/views/admin/pages/Dashboard/Dashboard.vue'
import CreateProduct from '@/views/admin/pages/CreateProduct/CreateProduct.vue'
import ModifyProduct from '@/views/admin/pages/ModifyProduct/ModifyProduct.vue'
import Accounts from '@/views/admin/pages/Accounts/Accounts.vue'
import CreateAccount from '@/views/admin/pages/CreateAccount/CreateAccount.vue'
import ModifyAccount from '@/views/admin/pages/ModifyAccount/ModifyAccount.vue'
import AdminAuthLayout from '@/views/admin/layouts/auth.vue'
import AdminLogin from '@/views/admin/pages/Auth/Login.vue'
import Roles from '@/views/admin/pages/Roles/Roles.vue'
import CreateRole from '@/views/admin/pages/CreateRole/CreateRole.vue'
import ModifyRole from '@/views/admin/pages/ModifyRole/ModifyRole.vue'
import Permissions from '@/views/admin/pages/Permissions/Permissions.vue'
import Categories from '@/views/admin/pages/Categories/Categories.vue'
import CreateCategory from '@/views/admin/pages/CreateCategory/CreateCategory.vue'
import ModifyCategory from '@/views/admin/pages/ModifyCategory/ModifyCategory.vue'
import Orders from '@/views/admin/pages/Orders/Orders.vue'
import Ingredients from '@/views/admin/pages/Ingredients/Ingredients.vue'
import CreateIngredient from '@/views/admin/pages/CreateIngredient/CreateIngredient.vue'
import ModifyIngredient from '@/views/admin/pages/ModifyIngredient/ModifyIngredient.vue'
import Suppliers from '@/views/admin/pages/Suppliers/Suppliers.vue'
import CreateSupplier from '@/views/admin/pages/CreateSupplier/CreateSupplier.vue'
import ModifySupplier from '@/views/admin/pages/ModifySupplier/ModifySupplier.vue'
import SupplyOrders from '@/views/admin/pages/SupplyOrders/SupplyOrders.vue'
import CreateSupplyOrder from '@/views/admin/pages/CreateSupplyOrder/CreateSupplyOrder.vue'
import ModifySupplyOrder from '@/views/admin/pages/ModifySupplyOrder/ModifySupplyOrder.vue'
import StockBatches from '@/views/admin/pages/StockBatches/StockBatches.vue'

const adminRouter = [
  {
    path: `/${systemConfig.adminPrefix}`,
    name: "AdminLayout",
    component: AdminLayout,
    children: [
      {
        path: "",
        name: "Dashboard",
        component: Dashboard,
        meta: { requireAuth: true }
      },
      {
        path: "products",
        name: "ProductsAdmin",
        component: ProductsAdmin,
        meta: { requireAuth: true }
      },
      {
        path: "products/create",
        name: "CreateProduct",
        component: CreateProduct,
        meta: { requireAuth: true }
      },
      {
        path: "products/modify/:id",
        name: "ModifyProduct",
        component: ModifyProduct,
        meta: { requireAuth: true }
      },
      {
        path: "accounts",
        name: "Accounts",
        component: Accounts,
        meta: { requireAuth: true }
      },
      {
        path: "accounts/create",
        name: "CreateAccount",
        component: CreateAccount,
        meta: { requireAuth: true }
      },
      {
        path: "accounts/modify/:id",
        name: "ModifyAccount",
        component: ModifyAccount,
        meta: { requireAuth: true }
      },
      {
        path: "roles",
        name: "Roles",
        component: Roles,
        meta: { requireAuth: true }
      },
      {
        path: "roles/create",
        name: "CreateRole",
        component: CreateRole,
        meta: { requireAuth: true }
      },
      {
        path: "roles/modify/:id",
        name: "ModifyRole",
        component: ModifyRole,
        meta: { requireAuth: true }
      },
      {
        path: "permissions",
        name: "Permissions",
        component: Permissions,
        meta: { requireAuth: true }
      },
      {
        path: "categories",
        name: "Categories",
        component: Categories,
        meta: { requireAuth: true }
      },
      {
        path: "categories/create",
        name: "CreateCategory",
        component: CreateCategory,
        meta: { requireAuth: true }
      },
      {
        path: "categories/modify/:id",
        name: "ModifyCategory",
        component: ModifyCategory,
        meta: { requireAuth: true }
      },
      {
        path: "orders",
        name: "Orders",
        component: Orders,
        meta: { requireAuth: true }
      },
      {
        path: "ingredients",
        name: "Ingredients",
        component: Ingredients,
        meta: { requireAuth: true }
      },
      {
        path: "ingredients/create",
        name: "CreateIngredient",
        component: CreateIngredient,
        meta: { requireAuth: true }
      },
      {
        path: "ingredients/modify/:id",
        name: "ModifyIngredient",
        component: ModifyIngredient,
        meta: { requireAuth: true }
      },
      {
        path: "suppliers",
        name: "Suppliers",
        component: Suppliers,
        meta: { requireAuth: true }
      },
      {
        path: "suppliers/create",
        name: "CreateSupplier",
        component: CreateSupplier,
        meta: { requireAuth: true }
      },
      {
        path: "suppliers/modify/:id",
        name: "ModifySupplier",
        component: ModifySupplier,
        meta: { requireAuth: true }
      },
      {
        path: "supply-orders",
        name: "SupplyOrders",
        component: SupplyOrders,
        meta: { requireAuth: true }
      },
      {
        path: "supply-orders/create",
        name: "CreateSupplyOrder",
        component: CreateSupplyOrder,
        meta: { requireAuth: true }
      },
      {
        path: "supply-orders/modify/:id",
        name: "ModifySupplyOrder",
        component: ModifySupplyOrder,
        meta: { requireAuth: true }
      },
      {
        path: "stock-batches",
        name: "StockBatches",
        component: StockBatches,
        meta: { requireAuth: true }
      },
    ]
  },
  {
    path: `/${systemConfig.adminPrefix}/auth`,
    name: "AdminAuthLayout",
    component: AdminAuthLayout,
    children: [
      {
        path: "login",
        name: "AdminLogin",
        component: AdminLogin,
        meta: { requireAuth: false }
      },
    ]
  }
]

export default adminRouter
