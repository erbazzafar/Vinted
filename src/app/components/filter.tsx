import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import axios from 'axios'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { Heart } from 'lucide-react'

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
        ` ${process.env.NEXT_PUBLIC_BACKEND_URL}/product/toggleLike`,
        { productId: product._id, userId: Cookies.get('userId') },
        {
          headers: {
            authorization: ` Bearer ${token}`,
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
    <div className="mt-5 bg-white shadow-md rounded-xl overflow-hidden py-2 relative w-full max-w-[250px] ">
      <div className="relative">
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image[0]}`}
          alt={product.name}
          height={200}
          width={10}
          unoptimized
          className="w-full h-[200px] object-contain rounded-lg"
        />
      </div>

      <div className="mt-3 px-2">
        <div className="flex justify-between items-center">
          <Link
            href={`/product/${product._id}`}
            className="text-[13px] font-semibold text-gray-800 hover:underline"
          >
            {product.name}
          </Link>

          <button
            className={`cursor-pointer transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-500 hover:text-red-300'
              }`}
            onClick={handleWishList}
          >
            <Heart size={20} fill={isWishlisted ? 'red' : 'none'} />
          </button>
        </div>

        <div className="flex items-center gap-1 mt-1">
          {getStarRating(product.rating)}
        </div>

        <p className="text-[12px] text-gray-500">
          Size: {product.sizeId?.name || 'None'}
        </p>
        <p className="text-[12px] text-gray-500">
          Category: {product.categoryId?.at(-1)?.name || 'N/A'}
        </p>
        <p className="text-[13px] font-semibold text-teal-600">
          ${product.price}
        </p>
        <p className="text-[13px] font-semibold text-teal-600">
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
  const [categoryName, setCategoryName] = useState("");

  const [hierarcy, setHierarcy] = useState([]);
  const [selectedName, setSelectedName] = useState("");

  useEffect(() => {
    const fetchingCategoryName = async () => {
      try {
        if (!categoryId) {
          return
        }
        const response = await axios.get(
          ` ${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get/${categoryId}`
        )
        if (response.status !== 200) {
          toast.error("Error fetching the category names")
          return
        }

        setCategoryName(response.data?.data?.name)

      } catch (error) {
        console.log("Error fetching the category name", error);
        return
      }
    };
    fetchingCategoryName();
    fn_Hierarchy();
  }, [categoryId])

  useEffect(() => {
    const getCategory = async () => {
      try {
        if (!categoryId) {
          return
        }
        const response = await axios.get(
          `  ${process.env.NEXT_PUBLIC_BACKEND_URL}/category/viewAll?parentCategoryId=${categoryId}`
        )

        if (response.status !== 200) {
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/viewAll?categoryId=${categoryId}&website=true`
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

  const fn_Hierarchy = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/parentHierarchy?categoryId=${categoryId}`
      );
      console.log("res ", response?.data);
      if (response?.data?.status === "ok") {
        setHierarcy(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    };
  };

  return (
    <div className="bg-white mt-15 mb-8 w-[90%] m-auto sm:w-full lg:px-[50px] ">
      <div className="container mx-auto max-w-screen-2xl">
        <div className="w-full h-[200px] sm:h-[500px] md:h-[550px] lg:h-[600px] overflow-hidden rounded-xl relative">
          <Image
            src="/category-banner.webp"
            alt="Slider Image"
            width={1920}
            height={1080}
            unoptimized
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black opacity-70"></div>
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 mx-auto w-fit items-center justify-center z-10 after:content-['']">
            <p className='text-white text-[30px] sm:text-[40px] md:text-[40px] lg:text-[55px] font-bold text-center after:block after:w-[100%] after:h-[3px] after:bg-gray-500 after:mt-2'>{hierarcy?.length === 0 ? categoryName : hierarcy?.[0]?.name}</p>
            <div className='flex gap-2 mt-[10px] text-[14px] justify-center text-gray-300'>
              {hierarcy?.map((i: any, index: number) => {
                return (
                  <p key={index}>{i?.name} /</p>
                )
              })}
              {hierarcy?.length > 0 && categoryName}
            </div>
          </div>
        </div>

        <div className='flex gap-2 mt-[30px] text-[18px] font-[700]'>
          {hierarcy?.map((i: any, index: number) => {
            return (
              <p key={index}>{i?.name} /</p>
            )
          })}
          {categoryName}
        </div>

        {category.length > 0 && (
          <ul className="flex gap-6 overflow-x-auto whitespace-nowrap no-scrollbar list-none border-b-4 py-6">
            {category.map((cat) => (
              <li key={cat._id}>
                <button
                  onClick={() => { handleCategoryClick(cat._id); setSelectedName(cat?.name) }}
                  className="text-blue-600 hover:underline cursor-pointer"
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