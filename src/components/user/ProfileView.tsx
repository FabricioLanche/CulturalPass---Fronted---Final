import { getProfile } from "@src/services/user/me";
import { ProfileForm } from './UserProfileForm';
import LatestEvents from "./LatestEvents";

export async function ProfileLayer() {
    const data = await getProfile();

    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="w-full bg-bg-alternative rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="w-full">
                    <ProfileForm data={data} />
                </div>

                <div className="w-full">
                    <LatestEvents />
                </div>
            </div>
        </div>
    )
}