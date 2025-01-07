@@ .. @@
   return (
     <div 
-      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
       onClick={onClick}
     >
       <div className="flex items-start justify-between mb-4">
@@ .. @@
       <div>
         <h4 className="font-medium text-sm text-gray-700 mb-2">Active Modules</h4>
         <div 
-          className="text-sm text-gray-500" 
          className="text-sm text-gray-500" 
           onClick={(e) => {
             e.stopPropagation();
             e.preventDefault();
           }}
         >
-          <ModulesList
-            onToggle={onModuleToggle}
-          />
          <ModulesList
            modules={store.modules}
            onToggle={onModuleToggle}
          />
         </div>
       </div>
     </div>
   );