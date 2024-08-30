import { Auth } from "../components/Auth"
import { Label } from "../components/Label"

export const Signin = () => {
    return <div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
            <div>
                <Auth type="signin" />
            </div>
            <div className="hidden lg:block">
                <Label />
            </div>
        </div>
    </div>
}