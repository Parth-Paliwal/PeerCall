const ClerkLayout = ({children} : {children : React.ReactNode})=>{
    return (
    <div className="flex items-center h-screen justify-center">
        {children}
    </div>)
}

export default ClerkLayout;