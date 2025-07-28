import React from 'react'

const ModalWrapper = ({ children }) => {
    return (

        <div className="fixed inset-0 bg-black top-0 w-screen  bg-opacity-60 z-60 flex justify-center items-center py-6 overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)' }}>
            <div className="absolute min-h-[calc(100vh-6rem)] bottom-0 w-screen bg-white grid place-items-center overflow-auto">
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ModalWrapper