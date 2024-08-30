import React, { useState, useEffect } from "react";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
    tipo: "gasto",
  });

  useEffect(() => {
    // Cargar categorías desde el localStorage
    const storedCategorias = JSON.parse(localStorage.getItem("categorias")) || [];
    setCategorias(storedCategorias);
  }, []);

  useEffect(() => {
    // Guardar categorías en el localStorage
    localStorage.setItem("categorias", JSON.stringify(categorias));
  }, [categorias]);

  const agregarCategoria = () => {
    if (nuevaCategoria.nombre) {
      setCategorias([...categorias, nuevaCategoria]);
      setNuevaCategoria({ nombre: "", tipo: "gasto" });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Agregar Categoría
          </h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="nombreCategoria" className="block text-sm font-medium text-gray-700">
                Nombre de la categoría
              </label>
              <input
                id="nombreCategoria"
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Nombre de la categoría"
                value={nuevaCategoria.nombre}
                onChange={(e) =>
                  setNuevaCategoria({
                    ...nuevaCategoria,
                    nombre: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="tipoCategoria" className="block text-sm font-medium text-gray-700">
                Tipo de categoría
              </label>
              <select
                id="tipoCategoria"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={nuevaCategoria.tipo}
                onChange={(e) =>
                  setNuevaCategoria({ ...nuevaCategoria, tipo: e.target.value })
                }
              >
                <option value="ingreso">Ingreso</option>
                <option value="gasto">Gasto</option>
              </select>
            </div>
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={agregarCategoria}
            >
              Agregar Categoría
            </button>
          </form>
        </div>
  );
};

export default Categorias;
    