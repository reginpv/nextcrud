import { APP_NAME } from '@/config/constants'

export default function Footer() {
  return (
    <footer className="bg-gray-200 dark:bg-gray-900 dark:text-white">
      <div className="container">
        <p className="text-sm font-normal text-center">
          {APP_NAME} &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
