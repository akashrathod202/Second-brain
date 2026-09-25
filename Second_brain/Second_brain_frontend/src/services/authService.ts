import api from "./api"

type Signup={
    name:string;
    email:string;
    password:string

}

type SigninData={
    email:string;
    password:string;
}


export const signup=async(data:Signup)=>{
    const response=await api.post("auth/signup",data)

    return response.data

}


export const signin=async(data:SigninData)=>{
    const response=await api.post("auth/signin",data)

    return  response.data
}

export const getuser =async()=>{
    const response=await api.get("auth/getuser")
    //  console.log("the user",response.data)
    return response.data
}