"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, ChangeEvent } from "react";
import { getAdmin, getProjects, getUserr } from "../api/services/service";
import Link from "next/link";
import { useDebounce } from "@/hooks/debounce-hook";

export interface Params {
  name?: string,
  order?: Order,
  take?: number,
  page?: number
}
export enum Order {
  Asc = 'ASC',
  Desc = 'DESC'
}


const Project = () => {
  const { data: session, status } = useSession();
  const [admin, setAdmin] = useState()
  const [project, setProject] = useState<[]>([])
  const [user, setUser] = useState()
  const [params, setParams] = useState<Params>({ page: 1, take: 10 })
  const debounce = useDebounce(params, 1000)


  const handleChange = (event: any) => { const { value } = event.target; setParams((prevState) => ({ ...prevState, order: prevState.order === value ? undefined : value })); };

  useEffect(() => {
    if (session)
      getPage()

  }, [session, debounce])

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  async function getPage() {
    const addmin = await getAdmin(session)
    const projects = await getProjects(session,params)
    const userr = await getUserr(session)
    setAdmin(addmin)
    setProject(projects)
    setUser(userr)
    console.log(addmin)
  }

  return (
    <div className=" w-screen">

      <div className="flex w-full md:w-[400px] mx-auto flex-col gap-y-1 gap-x-2">


        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input type="search" onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setParams({ ...params, name: e.target.value })
          }
          } defaultValue={params?.name} id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Project" required />
          </div>
      </div>

      <h1 className=" text-5xl text-center mx-auto font-bold w-screen my-5">Proyectos </h1>

      {admin ? (
        <div className="flex mx-auto md:mx-[15%] my-10 justify-center md:justify-end" >
          <Link href={"/project/new"}>
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Crear Proyecto</button>
          </Link>
        </div>) : (<></>)}{ }
      <div className="container grid-cols-1 sm:grid-cols-2 grid md:grid-cols-3 w-screen  mx-auto justify-center gap-y-5 ">
        {project.map((pro: any, i) => (
          <div key={i} className='max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-10'><pre>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate whitespace-nowrap overflow-ellipsis">{pro.name} </h5>
            <p className='mb-3 font-normal text-gray-700 dark:text-gray-400 container truncate whitespace-nowrap overflow-ellipsis'>
              {pro.description}
            </p>
            <Link href={`/project/${pro.id}?user=${user?.id}`} className='inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
              Detalle
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </Link>
          </pre>
          </div>
        ))}

      </div>

    </div>
  );
};
export default Project;