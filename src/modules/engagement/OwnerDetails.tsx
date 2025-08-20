import { Base_Url } from '@/constants/url'
import { useParams } from '@tanstack/react-router'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { User, Calendar, UtensilsCrossed, Users, Clock } from 'lucide-react'
import BreadCrumb from '@/components/breadcrumb/BreadCrumb'

const OwnerDetails = () => {
  const { id } = useParams({ from: `/engagements/$id` })
  const [ownerDetails, setOwnerDetails] = useState<any>(null)

  const fetchOwnerDetails = async () => {
  if (!id || typeof id !== "string") {
    console.warn("Invalid engagement ID:", id)
    return
  }

  try {
    const res = await axios.get(`${Base_Url}/engagements/${id}`)
    console.log("Fetched engagement details:", res.data)
    setOwnerDetails(res.data)
  } catch (err) {
    console.error("Error fetching engagement details:", err)
  }
}


  useEffect(() => {
    if(id){
      fetchOwnerDetails()
    }
  }, [id])

  if (!ownerDetails || Object.keys(ownerDetails).length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-600 animate-pulse">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-sky-200 via-gray-400 to-gray-200 p-6 flex flex-col">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-3xl p-8 space-y-6 transform hover:scale-[1.01] transition duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 border-b pb-4">
          <User className="text-purple-600 w-8 h-8" />
          <h1 className="text-2xl text-gray-800">
            Engagement Id - {id}
          </h1>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl shadow">
            <User className="text-purple-600 w-5 h-5" />
            <p className="font-medium">
              Owner: <span className="font-semibold">{ownerDetails.engagementOwner}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-pink-50 p-4 rounded-xl shadow">
            <Users className="text-pink-600 w-5 h-5" />
            <p className="font-medium">
              Speaker: <span className="font-semibold">{ownerDetails.speaker}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl shadow">
            <UtensilsCrossed className="text-green-600 w-5 h-5" />
            <p className="font-medium">
              Caterer: <span className="font-semibold">{ownerDetails.caterer}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-yellow-50 p-4 rounded-xl shadow">
            <Users className="text-yellow-600 w-5 h-5" />
            <p className="font-medium">
              Co-host: <span className="font-semibold">{ownerDetails.cohost}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl shadow col-span-1 md:col-span-2">
            <Calendar className="text-blue-600 w-5 h-5" />
            <p className="font-medium">
              Primary Date: <span className="font-semibold">
  {typeof ownerDetails.primaryDateTime === "string"
    ? ownerDetails.primaryDateTime
    : `${ownerDetails.primaryDateTime.date} ${ownerDetails.primaryDateTime.time} ${ownerDetails.primaryDateTime.timezone}`}
</span>

            </p>
          </div>

          <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-xl shadow col-span-1 md:col-span-2">
            <Calendar className="text-indigo-600 w-5 h-5" />
            <p className="font-medium">
              Secondary Date: <span className="font-semibold">
    {typeof ownerDetails.secondaryDateTime === "string"
      ? ownerDetails.secondaryDateTime
      : ownerDetails.secondaryDateTime
      ? `${ownerDetails.secondaryDateTime.date} ${ownerDetails.secondaryDateTime.time} ${ownerDetails.secondaryDateTime.timezone}`
      : "-"}
  </span>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-red-50 p-4 rounded-xl shadow col-span-1 md:col-span-2">
            <Calendar className="text-red-600 w-5 h-5" />
            <p className="font-medium">
              Tertiary Date: <span className="font-semibold">
  {typeof ownerDetails.tertiaryDateTime === "string"
    ? ownerDetails.tertiaryDateTime
    : ownerDetails.tertiaryDateTime
    ? `${ownerDetails.tertiaryDateTime.date} ${ownerDetails.tertiaryDateTime.time} ${ownerDetails.tertiaryDateTime.timezone}`
    : "-"}
</span>

            </p>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-xl shadow col-span-1 md:col-span-2">
            <Clock className="text-gray-600 w-5 h-5" />
            <p className="font-medium">
              Created At: <span className="font-semibold">{ownerDetails.createdDateTime}</span>
            </p>
          </div>
        </div>
      </div>
        <BreadCrumb/>
    </div>
  )
}

export default OwnerDetails
