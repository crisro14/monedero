import React, { useState, useEffect } from "react";
import { ReactComponent as FechaArriba } from "../assets/flecha_arriba.svg";
import { ReactComponent as FechaAbajo } from "../assets/flecha_abajo.svg";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Treemap
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C', '#D0ED57'];

export default function GestorFinanzas() {
  const [transacciones, setTransacciones] = useState([]);
  const [categorias, setCategorias] = useState([
    { nombre: "Salario", tipo: "ingreso" },
    { nombre: "Alimentación", tipo: "gasto" },
    { nombre: "Transporte", tipo: "gasto" },
  ]);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
    tipo: "gasto",
  });
  const [nuevaTransaccion, setNuevaTransaccion] = useState({
    tipo: "gasto",
    monto: 0,
    descripcion: "",
    fecha: "",
    categoria: "",
  });
  const [periodoGrafico, setPeriodoGrafico] = useState("mensual");

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const storedTransacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    const storedCategorias = JSON.parse(localStorage.getItem('categorias')) || [
      { id: 1, nombre: 'Salario', tipo: 'ingreso' },
      { id: 2, nombre: 'Alimentación', tipo: 'gasto' },
      { id: 3, nombre: 'Transporte', tipo: 'gasto' },
    ];
    setTransacciones(storedTransacciones);
    setCategorias(storedCategorias);
  }, []);

  // Guardar datos en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
  }, [transacciones]);

  useEffect(() => {
    localStorage.setItem('categorias', JSON.stringify(categorias));
  }, [categorias]);

  const agregarTransaccion = () => {
    if (
      nuevaTransaccion.monto &&
      nuevaTransaccion.descripcion &&
      nuevaTransaccion.fecha &&
      nuevaTransaccion.categoria
    ) {
      setTransacciones([
        ...transacciones,
        { ...nuevaTransaccion, id: Date.now() },
      ]);
      setNuevaTransaccion({
        tipo: "gasto",
        monto: 0,
        descripcion: "",
        fecha: "",
        categoria: "",
      });
    }
  };

  const agregarCategoria = () => {
    if (nuevaCategoria.nombre) {
      setCategorias([...categorias, nuevaCategoria]);
      setNuevaCategoria({ nombre: "", tipo: "gasto" });
    }
  };

  const obtenerDatosGrafico = () => {
    const datos = transacciones.reduce((acc, transaccion) => {
      let fecha = new Date(transaccion.fecha);
      let key;
      switch (periodoGrafico) {
        case "diario":
          key = fecha.toISOString().split("T")[0];
          break;
        case "semanal":
          key = `Semana ${Math.ceil((fecha.getDate() + fecha.getDay()) / 7)}`;
          break;
        case "mensual":
          key = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
          break;
        case "anual":
          key = fecha.getFullYear().toString();
          break;
        default:
          key = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
      }
      if (!acc[key]) {
        acc[key] = { ingresos: 0, gastos: 0 };
      }
      if (transaccion.tipo === "ingreso") {
        acc[key].ingresos += parseFloat(transaccion.monto);
      } else {
        acc[key].gastos += parseFloat(transaccion.monto);
      }
      return acc;
    }, {});

    return Object.entries(datos).map(([fecha, { ingresos, gastos }]) => ({
      fecha,
      ingresos,
      gastos,
    }));
  };

  const obtenerDatosPorCategoria = () => {
    return categorias.map(categoria => {
      const total = transacciones
        .filter(t => t.categoria === categoria.nombre)
        .reduce((sum, t) => sum + parseFloat(t.monto), 0);
      return { nombre: categoria.nombre, valor: total };
    }).filter(item => item.valor > 0);
  };

  const obtenerBalanceAcumulado = () => {
    let balance = 0;
    return transacciones
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .map(t => {
        balance += t.tipo === 'ingreso' ? parseFloat(t.monto) : -parseFloat(t.monto);
        return { fecha: t.fecha, balance };
      });
  };

  const obtenerDatosRadar = () => {
    return categorias.map(categoria => {
      const total = transacciones
        .filter(t => t.categoria === categoria.nombre)
        .reduce((sum, t) => sum + parseFloat(t.monto), 0);
      return { categoria: categoria.nombre, valor: total };
    });
  };

  const obtenerDatosTreemap = () => {
    return categorias.map(categoria => {
      const total = transacciones
        .filter(t => t.categoria === categoria.nombre)
        .reduce((sum, t) => sum + parseFloat(t.monto), 0);
      return { name: categoria.nombre, size: total };
    });
  };

  const obtenerDatosArea = () => {
    const datos = transacciones.reduce((acc, transaccion) => {
      const fecha = new Date(transaccion.fecha);
      const key = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
      if (!acc[key]) {
        acc[key] = { fecha: key, ingresos: 0, gastos: 0 };
      }
      if (transaccion.tipo === 'ingreso') {
        acc[key].ingresos += parseFloat(transaccion.monto);
      } else {
        acc[key].gastos += parseFloat(transaccion.monto);
      }
      return acc;
    }, {});

    return Object.values(datos).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulario Agregar Transacción */}
        <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Agregar Transacción
          </h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de transacción
              </label>
              <select
                id="tipo"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                value={nuevaTransaccion.tipo}
                onChange={(e) =>
                  setNuevaTransaccion({
                    ...nuevaTransaccion,
                    tipo: e.target.value,
                  })
                }
              >
                <option value="ingreso">Ingreso</option>
                <option value="gasto">Gasto</option>
              </select>
            </div>
            <div>
              <label htmlFor="monto" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Monto
              </label>
              <input
                id="monto"
                type="number"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                placeholder="Monto"
                value={nuevaTransaccion.monto || ""}
                onChange={(e) =>
                  setNuevaTransaccion({
                    ...nuevaTransaccion,
                    monto: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descripción
              </label>
              <input
                id="descripcion"
                type="text"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                placeholder="Descripción"
                value={nuevaTransaccion.descripcion}
                onChange={(e) =>
                  setNuevaTransaccion({
                    ...nuevaTransaccion,
                    descripcion: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fecha
              </label>
              <input
                id="fecha"
                type="date"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                value={nuevaTransaccion.fecha}
                onChange={(e) =>
                  setNuevaTransaccion({
                    ...nuevaTransaccion,
                    fecha: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Categoría
              </label>
              <select
                id="categoria"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                value={nuevaTransaccion.categoria}
                onChange={(e) =>
                  setNuevaTransaccion({
                    ...nuevaTransaccion,
                    categoria: e.target.value,
                  })
                }
              >
                <option value="">Seleccione una categoría</option>
                {categorias
                  .filter((cat) => cat.tipo === nuevaTransaccion.tipo)
                  .map((cat) => (
                    <option key={cat.nombre} value={cat.nombre}>
                      {cat.nombre}
                    </option>
                  ))}
              </select>
            </div>
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={agregarTransaccion}
            >
              Agregar Transacción
            </button>
          </form>
        </div>

        {/* Formulario Agregar Categoría */}
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
      </div>

      {/* Lista de Transacciones */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Lista de Transacciones
        </h2>
        <ul className="space-y-2">
          {transacciones.map((transaccion) => (
            <li
              key={transaccion.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <span
                className={
                  transaccion.tipo === "ingreso"
                    ? "text-green-500 font-medium"
                    : "text-red-500 font-medium"
                }
              >
                {transaccion.tipo === "ingreso" ? <FechaArriba /> : <FechaAbajo />}
              </span>
              <span className="text-gray-700">{transaccion.descripcion}</span>
              <span className="text-gray-700">{transaccion.categoria}</span>
              <span className="text-gray-700">{transaccion.fecha}</span>
              <span
                className={
                  transaccion.tipo === "ingreso"
                    ? "text-green-500 font-medium"
                    : "text-red-500 font-medium"
                }
              >
                {transaccion.tipo === "ingreso" ? "+" : "-"}${transaccion.monto}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Gráfico de Ingresos y Gastos */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Gráfico de Ingresos y Gastos
        </h2>
        <div className="mb-4">
          <label htmlFor="periodo" className="block text-sm font-medium text-gray-700">
            Período
          </label>
          <select
            id="periodo"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={periodoGrafico}
            onChange={(e) => setPeriodoGrafico(e.target.value)}
          >
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
            <option value="anual">Anual</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={obtenerDatosGrafico()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ingresos" fill="#4ade80" name="Ingresos" />
            <Bar dataKey="gastos" fill="#f87171" name="Gastos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Distribución por Categoría</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={obtenerDatosPorCategoria()}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="valor"
                label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
              >
                {obtenerDatosPorCategoria().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Balance Acumulado</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={obtenerBalanceAcumulado()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="balance" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Gastos por Categoría (Radar)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={obtenerDatosRadar()}>
              <PolarGrid />
              <PolarAngleAxis dataKey="categoria" />
              <PolarRadiusAxis />
              <Radar name="Gastos" dataKey="valor" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Distribución de Gastos (Treemap)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <Treemap
              data={obtenerDatosTreemap()}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="#8884d8"
            >
              <Tooltip />
            </Treemap>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Evolución de Ingresos y Gastos (Área)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={obtenerDatosArea()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="ingresos" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="gastos" stackId="1" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

    </div>
  );
}
