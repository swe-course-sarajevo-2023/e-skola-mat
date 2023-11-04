import ButtonAppBar from "@/components/navbar"

export default function ProfilesProfesorLayout({ children }) {
    
    return (
        <div>
        <ButtonAppBar/>
        {children}
        </div>
    )
  }