import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const url = "http://localhost:5000";
const AllUsers = () => {
  const { userDetail } = useSelector((state) => state.auth);
  console.log(userDetail);
  const queryClient = useQueryClient();

  const allUsersQuery = useQuery(
    ["allUsers", userDetail.user_id],
    ({ signal }) =>
      axios
        .get(`/api/allUsers`, { signal, withCredentials: true })
        .then((res) => res.data)
  );

  const mutation = useMutation({
    mutationFn: (followed_user_id) => {
      return axios.post(
        `/api/follow`,
        {
          user_id: userDetail?.user_id,
          followed_user_id,
        },
        {
          withCredentials: true,
        }
      );
    },

    onSuccess() {
      queryClient.invalidateQueries(["allUsers", userDetail.user_id]);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleFollow = (id) => {
    mutation.mutate(id);
  };

  const unfollowMutation = useMutation({
    mutationFn: (followed_user_id) => {
      return axios.post(`/api/unfollow`, {
        user_id: userDetail?.user_id,
        followed_user_id,
      });
    },

    onSuccess() {
      queryClient.invalidateQueries(["allUsers", userDetail?.user_id]);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleUnFollow = (id) => {
    unfollowMutation.mutate(id);
  };

  const deleteUserMutation = useMutation({
    mutationFn: (delete_user_id) => {
      return axios.delete(`/api/users/${delete_user_id}`);
    },

    onSuccess() {
      queryClient.invalidateQueries(["allUsers", userDetail?.user_id]);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleDeleteUser = (delete_user_id) => {
    if (!window.confirm("Are you sure?")) return;
    deleteUserMutation.mutate(delete_user_id);
  };

  if (allUsersQuery.isLoading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-12 my-5">
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
        <table className=" w-full  border-collapse  text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Name
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Email
              </th>

              <th
                scope="col"
                className="px-6 py-4 font-medium text-gray-900"
              ></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {allUsersQuery.data &&
              allUsersQuery.data.map((item) => {
                return (
                  <tr className="hover:bg-gray-50 " key={item.user_id}>
                    <th className="flex  items-center gap-3 px-6 py-4 font-normal text-gray-900">
                      <div className="relative h-10 w-10">
                        <img
                          src={
                            item.profilepic ||
                            "https://cdn-icons-png.flaticon.com/128/3899/3899618.png"
                          }
                          loading="lazy"
                          alt="Photo by Aiony Haust"
                          className="h-full w-full rounded-full object-cover
                        object-center"
                        />
                        {/* <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span> */}
                      </div>
                      <div className="text-base font-medium text-gray-700">
                        <Link to={`/profile/${item.user_id}`}>
                          {item?.name}
                        </Link>
                      </div>
                    </th>
                    <td className="px-6 py-4">{item?.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {item?.isfollowed ? (
                          <button
                            onClick={() => handleUnFollow(item?.user_id)}
                            type="button"
                            className="w-24 rounded-lg border border-red-500 bg-red-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-red-700 hover:bg-red-700 focus:ring focus:ring-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-300"
                          >
                            Unfollow
                          </button>
                        ) : (
                          <button
                            onClick={() => handleFollow(item?.user_id)}
                            type="button"
                            className="w-24 rounded-lg border border-blue-500 bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-blue-700 hover:bg-blue-700 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:border-blue-300 disabled:bg-blue-300"
                          >
                            Follow
                          </button>
                        )}
                      </div>
                    </td>

                    {userDetail.isadmin && (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteUser(item?.user_id)}
                          type="button"
                          className="w-24 rounded-lg border border-rose-600 bg-rose-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-rose-700 hover:bg-rose-700 focus:ring focus:ring-rose-200 disabled:cursor-not-allowed disabled:border-rose-300 disabled:bg-rose-300"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
