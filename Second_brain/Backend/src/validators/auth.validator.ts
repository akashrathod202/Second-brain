import {z} from "zod"


  export const SignupSchema=z.object({
    name:z
    .string()
    .min(2,"Name must be at least 2 characters")
    .max(50,"Name must not excced to charecter"),

    email:z
      .string()
      .email("invalid emial address"),

    password:z
           .string()
           .min(6,"Password must be at least 6 cahracters")


})


 


 const SigninpSchema=z.object({
   

    email:z
      .string()
      .email("invalid emial address"),

    password:z
           .string()
           .min(6,"Password must be at least 6 cahracters")


})
 export default SigninpSchema
 