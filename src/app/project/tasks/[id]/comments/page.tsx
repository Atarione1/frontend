"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { deleteProject, getAdmin, getProject, getUserr } from "@/app/api/services/service";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteTask, getTask, getTasks } from "@/app/api/services/serviceTasks";
import { Project } from "../../[id]/page";

export interface Props {
  params: {
    id: string;
  };
}
export interface Task {
  id: string;
  name: string
  description: string
  finishedAt: string
}


const Project = ({ params }: Props) => {
  const { data: session, status } = useSession();
  const [admin, setAdmin] = useState()
  const [user, setUser] = useState()
  const [project, setProject] = useState<Project>()
  const [tasks, setTasks] = useState<Task>()
  const searchParams = useSearchParams()
  const newTask = searchParams.get('task')
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
     const userr = await getUserr(session)
    setAdmin(addmin)
    setProject(project)
    setUser(userr)
    getUser()
  }
  async function getUser() {
    
     const taskss = await getTask(session,newTask)
    
    setTasks(taskss)
   
  }
  const handleSubmit = async () => {

    await deleteTask(session, newTask)
    router.push(`/project/${params?.id}?user=${user?.id}`);

  };

  return (
    <div className="w-screen">
      <h1 className=" text-3xl md:text-5xl text-center mx-auto font-bold w-screen">{tasks?.name} </h1>
      <div className=" w-screen mx-auto justify-center">
        <div className=' w-[300px] md:w-screen h-20 justify-center mx-3 text-ellipsis text-center  md:mx-auto my-10'><pre>
          <p className='text-center md:text-lg mb-3 font-normal text-gray-700 dark:text-gray-400 container text-ellipsis'>
            {tasks?.description}
          </p>
        </pre>
        </div>
      </div>
      {admin ? (
        <div className="flex mx-auto w-full my-10 justify-center" >
          <div>
            <Link href={`/project/tasks/${newTask}/edit`}>
              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Editar Tarea

              </button>
            </Link>
            <button onClick={handleSubmit} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">ELiminar Tarea
            </button>
          </div>
        </div>) : (<></>)}{ }

        <div>
     

    </div>
    </div>
  );
};
export default Project;