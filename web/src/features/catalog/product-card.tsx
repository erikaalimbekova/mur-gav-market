import Link from "next/link"
import type { Product } from "@/lib/types"
import { ProductImage } from "@/features/product/product-image"
import { Price, discountPercent } from "@/features/product/price"
import { AddToCartButton } from "@/features/cart/add-to-cart-button"
import { cn } from "@/lib/utils"

export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product.price, product.old_price)
  const outOfStock = product.stock < 1
  return (
    <article className="flex flex-col gap-1.5 rounded-2xl border bg-card p-3 transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(59,36,22,0.08)]">
      <Link href={`/product/${product.id}`} className={cn("relative block", outOfStock && "opacity-50")}>
        <ProductImage name={product.name} imageUrl={product.image_url} animal={product.animal} foodType={product.food_type} />
        {discount && (
          <span className="absolute top-2 left-2 rounded-full bg-sale px-2.5 py-0.5 text-xs font-extrabold text-white">
            −{discount}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute top-2 right-2 rounded-full bg-foreground/80 px-2.5 py-0.5 text-xs font-bold text-white">
            Нет в наличии
          </span>
        )}
      </Link>
      <div className="text-[13px] font-semibold text-muted-foreground">{product.brand?.name}</div>
      <Link href={`/product/${product.id}`} className="line-clamp-2 min-h-[2.6em] text-[15px] leading-snug font-bold hover:text-primary">
        {product.name}
      </Link>
      <div className="text-[13px] text-muted-foreground">{product.weight}</div>
      <Price price={product.price} oldPrice={product.old_price} />
      <div className="mt-auto pt-1">
        <AddToCartButton productId={product.id} stock={product.stock} />
      </div>
    </article>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
