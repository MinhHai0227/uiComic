import EditUserProfile from "@/components/home/edit-user-profile";
import UploadAvatarForm from "@/components/home/upload-avatar-form";

const ProfileUser = () => {
  
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="my-3">
        <UploadAvatarForm />
      </div>
      <div className="col-span-2 mt-10 px-2 my-3"> 
        <EditUserProfile />
      </div>
    </div>
  );
};
export default ProfileUser;
