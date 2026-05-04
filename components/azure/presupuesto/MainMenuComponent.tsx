'use client'; //  Necesario para hooks y eventos del DOM

import React from 'react';
import { useRouter } from 'next/navigation';

//  Definimos la interfaz de los módulos
interface Module {
  title: string;
  description: string;
  path: string;
}

const MainMenuComponent: React.FC = () => {
  const router = useRouter();

  // Array de módulos tipado
  const modules: Module[] = [
    {
      title: '📊 Costos vs Presupuesto',
      description: 'Visualiza y compara el presupuesto con los costos reales.',
      path: '/azure/presupuesto/costos-vs-presupuesto',
    },
    {
      title: '🏷️ Centros de Costo',
      description: 'Carga y gestiona los centros de costo',
      path: '/azure/presupuesto/centro-de-costo',
    },
    {
      title: '💰 Presupuestos Anuales',
      description: 'Carga y administra los presupuestos anuales',
      path: '/azure/presupuesto/presupuesto-anual',
    },
    {
      title: '💰 Presupuestos Mensuales',
      description: 'Carga y administra los presupuestos mensuales',
      path: '/azure/presupuesto/presupuesto-mensual',
    },
    // Puedes agregar más módulos aquí
  ];

  return (
    // <div className="min-h-screen bg-gray-100 p-8">
    <div className="w-full min-w-0">
        {/* <h1 className="text-3xl font-bold mb-6">Panel Principal</h1> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <div
              key={mod.path}
              className="bg-white shadow-md p-4 rounded-lg border cursor-pointer hover:shadow-xl transition"
              onClick={() => router.push(mod.path)} // Navegación usando Next.js
            >
              <h2 className="text-xl font-semibold mb-2">{mod.title}</h2>
              <p className="text-sm text-gray-600">{mod.description}</p>
            </div>
          ))}
        </div>
    </div>
  );
};

export default MainMenuComponent;

// 'use client'; //  Necesario para hooks y eventos del DOM

// import React from 'react';
// import { useRouter } from 'next/navigation';


// import { useSession } from '@/hooks/useSession';

// //  Definimos la interfaz de los módulos
// interface Module {
//   title: string;
//   description: string;
//   path: string;
// }

// const MainMenuComponent: React.FC = () => {
//   const router = useRouter();
//   const { user: userLoggedIn } = useSession();



//   const dbAws = userLoggedIn?.user_db_aws;
//   const dbAzure = userLoggedIn?.user_db_azure;
//   const dbGcp = userLoggedIn?.user_db_gcp;

//   // Array de módulos tipado
//   const modules: Module[] = [
//     {
//       title: '📊 Costos vs Presupuesto',
//       description: 'Visualiza y compara el presupuesto con los costos reales.',
//       path: '/azure/presupuesto/costos-vs-presupuesto',
//     },
//     {
//       title: '🏷️ Centros de Costo',
//       description: 'Carga y gestiona los centros de costo',
//       path: '/azure/presupuesto/centro-de-costo',
//     },
//     {
//       title: '💰 Presupuestos Anuales',
//       description: 'Carga y administra los presupuestos anuales',
//       path: '/azure/presupuesto/presupuesto-anual',
//     },
//     {
//       title: '💰 Presupuestos Mensuales',
//       description: 'Carga y administra los presupuestos mensuales',
//       path: '/azure/presupuesto/presupuesto-mensual',
//     },
//     // Puedes agregar más módulos aquí
//   ];

//   return (
//       <div className="w-full min-w-0 flex flex-col gap-6">
          
//           {userLoggedIn && (
//               <div className="bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-700 flex gap-6">
//                   <div>
//                       <span className="text-slate-400 text-xs font-bold block mb-1">AWS DB:</span>
//                       <span className="text-amber-400 text-sm font-mono">{dbAws || 'No asignada'}</span>
//                   </div>
//                   <div>
//                       <span className="text-slate-400 text-xs font-bold block mb-1">AZURE DB:</span>
//                       <span className="text-blue-400 text-sm font-mono">{dbAzure || 'No asignada'}</span>
//                   </div>
//                   <div>
//                       <span className="text-slate-400 text-xs font-bold block mb-1">GCP DB:</span>
//                       <span className="text-emerald-400 text-sm font-mono">{dbGcp || 'No asignada'}</span>
//                   </div>
//               </div>
//           )}
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {modules.map((mod) => (
//               <div
//                 key={mod.path}
//                 className="bg-white shadow-md p-4 rounded-lg border cursor-pointer hover:shadow-xl transition"
//                 onClick={() => router.push(mod.path)} 
//               >
//                 <h2 className="text-xl font-semibold mb-2">{mod.title}</h2>
//                 <p className="text-sm text-gray-600">{mod.description}</p>
//               </div>
//             ))}
//           </div>
//       </div>
//     );
//   };

// export default MainMenuComponent;
