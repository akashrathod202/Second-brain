export type Content ='link' | "note"|"video";


export type content={
    _id:string;
    title:string;
    type:"ContentType",
    link?:string;
    description?:string
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}