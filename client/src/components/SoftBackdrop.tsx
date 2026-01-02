const SoftBackdrop = () => {
    return (
        <div>
            <div className='fixed inset-0 -z-1 pointer-events-none bg-[#050005]'>
                <div className='absolute left-1/2 top-10 -translate-x-1/2 w-245 h-115 bg-linear-to-tr from-pink-600/20 to-transparent rounded-full blur-[120px]' />

                <div className='absolute right-[-5%] bottom-[-10%] w-120 h-80 bg-linear-to-bl from-pink-500/15 to-transparent rounded-full blur-[100px]' />

                <div className='absolute left-[-10%] top-[-10%] w-100 h-100 bg-pink-900/10 rounded-full blur-[120px]' />
            </div>
        </div>
    )
}

export default SoftBackdrop