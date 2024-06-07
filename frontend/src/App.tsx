import { useEffect, useState } from 'react'
import './App.css'
import FilterField from './components/filter-field'
import TUser from './models/user'
import axios from 'axios'
import UserCard from './components/user-card'
import { RotatingLines } from 'react-loader-spinner'
import TDataResponse from './models/data-response'
import UploadButton from './components/upload-button'
import { useToast } from './components/ui/use-toast'

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [users, setUsers] = useState<TUser[]>([]);
  const { toast } = useToast()

  const loadData = async (q: string) : Promise<void> => {
    try {
      setIsLoading(true);
      const filters: string[] = q.split(' ');
      const resp: TDataResponse<TUser[]> = (
        await axios.get<TDataResponse<TUser[]>>(
          '/api/users', { params: { q: filters }, paramsSerializer: { indexes: null } }
        )
      ).data;
      setUsers(resp.data);
      setFilter(q);
    } catch (err: unknown) {
      toast({
        variant: 'destructive',
        title: String(err),
      })
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = (q: string) : void => {
    loadData(q);
  }

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }
    
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('file', files[files.length - 1]);

      await axios.post('/api/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      loadData('')

    } catch (err: unknown) {
      toast({
        variant: 'destructive',
        title: String(err),
      })
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (filter === null) {
      loadData('');
    }
  }, [filter]);

  return (
    <div className="w-full">
      <div className="flex items-center mb-1">
        <FilterField data-testid="search-input" onFilter={handleSearch} />
        <UploadButton onSelect={handleUpload} data-testid="upload-button">Upload</UploadButton>
      </div>
      <div className="w-full flex justify-center h-6 mb-1">
        <RotatingLines
          visible={isLoading}
          width="24"
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap--8 lg:gap-10">
        {users.map((value: TUser, index: number) => <UserCard data-testid="info-card" key={index} user={value} />)}
      </div>

    </div>
  )
}

export default App
