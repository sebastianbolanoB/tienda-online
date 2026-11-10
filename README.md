# La Percha - tienda online

Tienda de ropa y accesorios hecha con Next.js, Prisma y PostgreSQL. Es un proyecto de práctica de un flujo de compra completo: catálogo con búsqueda, carrito, pedido y pago con Wompi en modo sandbox. También tiene un panel de admin para manejar los productos y ver los pedidos.

## Para correrla

Hay que tener Node y Docker.

```
npm install
docker compose up -d
```

Copiar `.env.example` a `.env`. `JWT_SECRET` es cualquier texto largo y `ADMIN_PASSWORD` es la contraseña con la que queda el admin.

Después crear las tablas y cargar los productos de ejemplo:

```
npx prisma migrate dev
npm run seed
npm run dev
```

La tienda abre en http://localhost:3000 y el panel en http://localhost:3000/admin (el correo del admin es el que esté en `ADMIN_EMAIL`).

## Pagos con Wompi

Las llaves de prueba salen de una cuenta en https://comercios.wompi.co, son tres: la llave pública, el secreto de integridad y el secreto de eventos. Van en el `.env`. Si no están, el pedido se crea igual pero queda pendiente.

Tarjeta de prueba: 4242 4242 4242 4242, cualquier fecha y cualquier CVC.

El webhook es `/api/wompi/webhook`. En local Wompi no lo puede llamar a menos que se use ngrok o algo parecido, pero no es grave porque cuando Wompi redirige de vuelta a la tienda la página del pedido consulta la transacción y actualiza el estado.

## Cosas a tener en cuenta

- Los precios del pedido se calculan en el servidor con lo que hay en la base de datos, el navegador solo manda ids y cantidades.
- El carrito se guarda en localStorage, no hay cuentas de cliente.
- Un producto que ya tiene pedidos no se borra, se oculta.

## Pendiente

- subir la imagen del producto (por ahora se pega la url)
- paginar los pedidos en el panel
- pruebas de las rutas del api, solo hay de las funciones de `lib`

Las pruebas se corren con `npm test`.
