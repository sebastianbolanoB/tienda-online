import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatoPrecio, precioConDescuento, recortar } from "@/lib/utils";
import BotonAgregar from "@/components/BotonAgregar";

const categorias = ["ropa", "calzado", "accesorios", "hogar"];

export default async function Home({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const q = params.q || "";
  const cat = params.cat || "";
  const pagina = parseInt(params.pagina) || 1;

  const where: any = { activo: true };
  if (q) {
    where.OR = [
      { nombre: { contains: q, mode: "insensitive" } },
      { descripcion: { contains: q, mode: "insensitive" } },
    ];
  }
  if (cat) where.categoria = cat;

  const total = await prisma.producto.count({ where });
  const productos = await prisma.producto.findMany({
    where,
    orderBy: { creado: "desc" },
    skip: (pagina - 1) * 8,
    take: 8,
  });
  const totalPaginas = Math.floor(total / 8) + 1;

  function link(p: number) {
    let url = "/?pagina=" + p;
    if (q) url += "&q=" + encodeURIComponent(q);
    if (cat) url += "&cat=" + cat;
    return url;
  }

  return (
    <div>
      <form className="buscador" action="/">
        <input type="text" name="q" placeholder="Buscar productos..." defaultValue={q} />
        <select name="cat" defaultValue={cat}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button className="btn">Buscar</button>
      </form>

      {q && <p className="resultado">Resultados para "{q}": {total}</p>}

      <div className="grilla">
        {productos.map((p) => (
          <div className="tarjeta" key={p.id}>
            <Link href={"/producto/" + p.id}>
              <img src={p.imagen || "/sin-imagen.svg"} alt={p.nombre} />
              <h3>{p.nombre}</h3>
            </Link>
            <p className="desc">{recortar(p.descripcion, 50)}</p>
            {p.descuento > 0 ? (
              <p className="precio">
                <span className="tachado">{formatoPrecio(p.precio)}</span>{" "}
                {formatoPrecio(precioConDescuento(p.precio, p.descuento))}
              </p>
            ) : (
              <p className="precio">{formatoPrecio(p.precio)}</p>
            )}
            <BotonAgregar producto={p} />
          </div>
        ))}
      </div>

      <div className="paginacion">
        {pagina > 1 && <Link href={link(pagina - 1)}>Anterior</Link>}
        <span>
          Página {pagina} de {totalPaginas}
        </span>
        {pagina < totalPaginas && <Link href={link(pagina + 1)}>Siguiente</Link>}
      </div>
    </div>
  );
}
