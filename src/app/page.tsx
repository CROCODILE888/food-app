// Root Home page
'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getInitialData } from "./shared/util/apiService";

export default function Home() {

  const router = useRouter();

  const [initialData, setInitialData] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getInitialData();
        setInitialData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInitialData();
    console.log(initialData);

  }, []);

  useEffect(() => {
    router.push('/home');
  }, [router]);

  return null
}
