import { useContext } from "react"
import AuthContext from "../context/AuthContext"
import EditUser from "./EditUser"
import EditShelter from "./EditShelter"

function ManageProfile() {
    const { userType } = useContext(AuthContext)

    if (userType === "user") {
        return (
            <EditUser />
        )
    } else if (userType === "shelter") {
        return (
            <EditShelter />
        )
    }
}

export default ManageProfile