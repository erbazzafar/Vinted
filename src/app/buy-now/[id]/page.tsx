// "use client";

// import { useParams } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { products } from "@/app/components/lensDemo";

// const BuyNow = () => {
//   const { id } = useParams();
//   console.log(id);
  
//   const product = products.find((p) => p.id === Number(id)); 

//   if (!product) {
//     return <div className="text-center text-red-500">Product not found</div>;
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen p-6">
//       <Card className="w-full max-w-lg shadow-lg rounded-xl border">
//         <CardHeader>
//           <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-t-xl" />
//         </CardHeader>
//         <CardContent>
//           <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
//           {/* <CardDescription className="text-lg text-gray-700">{`Rating: ${product.rating} ⭐ (${product.sold} Sold)`}</CardDescription> */}
//           <CardDescription className="text-xl font-semibold text-gray-900">${product.price}</CardDescription>
//           <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
//             Buy Now
//           </button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default BuyNow;
