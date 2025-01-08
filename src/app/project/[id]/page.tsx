"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { deleteProject, getAdmin, getProject, getUserr } from "@/app/api/services/service";
import Link from "next/link";
import { useRouter, useSearchParams  } from "next/navigation";
import { getTasks, getTaskss, getUserTask } from "@/app/api/services/serviceTasks";

export interface Props {
  params: {
    id: string;
  },

}
export interface Project {
  id: string;
  name: string
  description: string
  createdAt: string
}

 const Project = ({ params}: Props) => {
  const { data: session, status } = useSession();
  const [admin, setAdmin] = useState()
  const [user, setUser] = useState()
  const [project, setProject] = useState<Project>()
  const [tasks, setTasks] = useState<[]>([])
  const searchParams = useSearchParams()
  const newUser = searchParams.get('user')
  const router = useRouter();

  useEffect(() => {
    if (session){getPage()}
      
   

  }, [session])

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  async function getPage() {
    const addmin = await getAdmin(session)
    const project = await getProject(session, params?.id)
     const userr = await getUserTask(session,newUser)
    setAdmin(addmin)
    setProject(project)
    setUser(userr)
    
    if(addmin){
      const taskss = await getTaskss(session,params?.id)
    setTasks(taskss)
    }else{
      const taskss = await getTasks(session,params?.id,newUser)
    setTasks(taskss)
    }
  }

  

  return (
    <div className="w-screen">
      <h1 className=" text-3xl md:text-5xl text-center mx-auto font-bold w-screen">{project?.name} </h1>
      <div className=" w-screen mx-auto justify-center">
        <div className=' w-[300px] md:w-screen h-20 justify-center mx-3 text-ellipsis text-center  md:mx-auto my-10'><pre>
          <p className='text-center md:text-lg mb-3 font-normal text-gray-700 dark:text-gray-400 container text-ellipsis'>
            {project?.description}
          </p>
        </pre>
        <p className='text-center md:text-lg mb-3 font-normal text-gray-700 dark:text-gray-400 container text-ellipsis'>
   
          </p>
        </div>
      </div>
      {admin ? (
        <div className="flex mx-auto w-full my-10 justify-center" >
          <div>
            <Link href={`/project/${params?.id}/edit`}>
              <button className="text-white bg-black hover:bg-black focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-black dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-black">Editar Proyecto

              </button>
            </Link>
            
          </div>
        </div>) : (<></>)}{ }

        <div>
      <h1 className=" text-5xl text-center mx-auto font-bold w-screen my-5">Tareas </h1>
      {admin ? (
        <div className="flex mx-16 my-10 justify-center" >
          <Link href={`/project/tasks/new?project=${params.id}&user=${newUser}`}>
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Crear Tarea</button>
          </Link>
        </div>) : (<></>)}{ }
      <div className="container grid-cols-1 sm:grid-cols-2 grid md:grid-cols-3 w-screen  mx-auto justify-center gap-y-5 ">
        {tasks.map((pro: any, i) => (
          <div key={i} className='max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-10'><pre>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate whitespace-nowrap overflow-ellipsis">{pro.name} </h5>
            <p className='mb-3 font-normal text-gray-700 dark:text-gray-400 container truncate whitespace-nowrap overflow-ellipsis'>
              {pro.description}
            </p>
            <Link href={`/project/tasks/${params?.id}?task=${pro.id}`} className='inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
              Detalle Tarea
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </Link>
          </pre>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};
export default Project;