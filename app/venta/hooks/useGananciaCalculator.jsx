// import { appStore } from "../../store/appStore";

// export const useGananciaCalculator = () => {
//   const store = appStore((state) => state.store);

//   const calcularGanancia = (
//     precio_venta,
//     precio_costo,
//     amount,
//     moneda_PC,
//     moneda_PV,
//   ) => {
//     let ganancia_CUP = 0;
//     let ganancia_USD = 0;

//     const pc = moneda_PC.toLowerCase();
//     const pv = moneda_PV.toLowerCase();

//     if (pc === "cup" && pv === "cup") {
//       ganancia_CUP = (precio_venta - precio_costo) * amount;
//     } else if (pc === "usd" && pv === "cup") {
//       ganancia_CUP = (precio_venta - precio_costo * store.tasa_usd) * amount;
//     } else if (pc === "cup" && pv === "usd") {
//       ganancia_CUP = (precio_venta * store.tasa_usd - precio_costo) * amount;
//     } else if (pc === "usd" && pv === "usd") {
//       ganancia_USD = (precio_venta - precio_costo) * amount;
//     }

//     return { ganancia_CUP, ganancia_USD };
//   };

//   return { calcularGanancia };
// };
