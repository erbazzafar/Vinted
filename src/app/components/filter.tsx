import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import axios from 'axios'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { reauthenticateWithRedirect } from 'firebase/auth'

interface Product {
  _id: string
  name: string
  image: string[]
  price: number
  inclPrice: number
  rating: number
  sizeId?: { name: string }
  categoryId?: { name: string }[]
  like?: string[]
}

interface Category {
    _id: string;
    name: string;
    subCategoryCount: number;
    parentCategoryId?: string;
  }

const getStarRating = (rating: number) => {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 !== 0
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

  return (
    <span className="text-yellow-500 text-lg">
      {'★'.repeat(fullStars)}
      {halfStar && '☆'}
      {'☆'.repeat(emptyStars)}
    </span>
  )
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const token = Cookies.get('token')

  const handleWishList = async () => {
    if (!product._id) return

    if (!token) {
      toast.error('Please log in to add to wishlist')
      return
    }

    const prev = isWishlisted
    setIsWishlisted(!isWishlisted)

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/toggleLike`,
        { productId: product._id, userId: Cookies.get('userId') },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status !== 200) {
        toast.error('Error adding to wishlist')
        setIsWishlisted(prev)
        return
      }

      toast.success(response.data.message)
    } catch (error) {
      toast.error('Error adding to wishlist')
      setIsWishlisted(prev)
      console.error(error)
    }
  }

  useEffect(() => {
    const userId = Cookies.get('userId')
    if (userId && Array.isArray(product.like)) {
      setIsWishlisted(product.like.includes(userId))
    }
  }, [product.like])

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden py-2 relative w-full max-w-[300px]">
      <div className="relative">
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image[0]}`}
          alt={product.name}
          height={300}
          width={300}
          unoptimized
          className="w-full h-[300px] object-cover rounded-lg"
        />
      </div>

      <div className="mt-3 px-2">
        <div className="flex justify-between items-center">
          <Link
            href={`/product/${product._id}`}
            className="text-lg font-semibold text-gray-800 hover:underline"
          >
            {product.name}
          </Link>

          <button
            className={`cursor-pointer transition-colors ${
              isWishlisted ? 'text-red-500' : 'text-gray-500 hover:text-red-300'
            }`}
            onClick={handleWishList}
          >
            <Heart size={22} fill={isWishlisted ? 'red' : 'none'} />
          </button>
        </div>

        <div className="flex items-center gap-1 mt-1">
          {getStarRating(product.rating)}
        </div>

        <p className="text-md text-gray-500">
          Size: {product.sizeId?.name || 'None'}
        </p>
        <p className="text-md text-gray-500">
          Category: {product.categoryId?.at(-1)?.name || 'N/A'}
        </p>
        <p className="text-lg font-semibold text-teal-600">
          ${product.price}
        </p>
        <p className="text-lg font-semibold text-teal-600">
          ${product.inclPrice}{' '}
          <span className="text-xs text-gray-400">incl.</span>
        </p>
      </div>
    </div>
  )
}

function Filter() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('id')

  const router = useRouter()
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  const [path, setPath] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("")

  useEffect(() => {
    const fetchingCategoryName = async () => {
        try {
            if (!categoryId){
                return
            }
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/viewAll`
            )
            if(response.status !== 200) {
                toast.error("Error fetching the category names")
                return
            }

            const allCategories = response.data.data
            const matchedCategory = allCategories.find((cat) => {
                return cat._id === categoryId
            })

            if (matchedCategory){
                setCategoryName(matchedCategory.name)

                setPath((prev) => {
                    const exists = prev.find((c) => c._id === matchedCategory._id);
                    if (exists) return prev;
                    return [...prev, matchedCategory];
                })

                return
            } 

        } catch (error) {
            console.log("Error fetching the category name", error);
            return
        }
    }
    fetchingCategoryName()
  }, [categoryId])

  useEffect( () => {
    const getCategory = async () => {
        try {
            if(!categoryId){
                return
            }
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/viewAll?parentCategoryId=${categoryId}`
            )
            
            if (response.status !== 200){
                toast.error("Error Fetching the Subcategories")
                return
            }
            console.log("category response: ", response);
            setCategory(response.data.data)

            const categoryName = response.data.data.name
            console.log("category name: ", categoryName);
            
        } catch (error) {
            console.log("Error fetching the category and it subCategory", error)
            return
        }
    }
    getCategory()
  }, [categoryId])

  useEffect(() => {
    const products = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/viewAll?categoryId=${categoryId}`
        )

        if (response.status !== 200) {
          toast.error('Error fetching the Filtered Products')
          return
        }

        setFilteredProducts(response.data.data)
      } catch (error) {
        console.error('Error fetching the filtered Products', error)
        toast.error('Error in fetching these Products')
      }
    }

    if (categoryId) {
      products()
    }
  }, [categoryId])

  const handleCategoryClick = (id: string) => {
    router.push(`?id=${id}`);
  };


  return (
    <div className="bg-white mt-15 w-full">
      <div className="container mx-auto max-w-screen-2xl">
        <div className="w-full h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] overflow-hidden rounded-xl">
          <Image
            src="/cat.jpeg"
            alt="Slider Image"
            width={1920}
            height={1080}
            unoptimized
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <h1 className="text-2xl font-bold my-6 py-4 border-b-4">
            {path.map((p, index) => (
                <span key={p._id}>
                {p.name}
                {index < path.length - 1 && " / "}
                </span>
            ))}
        </h1>

        {category.length > 0 && (
            <ul className="flex gap-4 overflow-x-auto whitespace-nowrap no-scrollbar list-none border-b-4 py-6">
                {category.map((cat) => (
                <li key={cat._id}>
                    <button
                    onClick={() => handleCategoryClick(cat._id)}
                    className="text-blue-600 hover:underline"
                    >
                    {cat.name}
                    </button>
                </li>
                ))}
            </ul>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-6 justify-items-center">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Filter