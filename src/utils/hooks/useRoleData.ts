import { Base_Url } from '@/constants/url'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'



const useRoleData = () => {

  const fetchData = async()=>{
    try{
      const res = await axios.get(Base_Url + "/clients")
      return res.data
    }catch(err){
      console.error(err)
    }
  }

  const {data,isError,isLoading} = useQuery({
    queryKey:['client'],
    queryFn:fetchData
  })

  return {
    data,
    isError,
    isLoading
}
}

export default useRoleData