import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";



const initialState = {
    loading: false,
    status: false,
    userData: null,
    error: null
}


export const createAccount = createAsyncThunk( "auth/register", async (data) => {

    const formData = new FormData()

    formData.append("username", data.username);
    formData.append("email", data.email)
    formData.append("password", data.password)
    formData.append("fullName", data.fullName)
    formData.append("avatar", data.avatar[0])

    if (data.coverImage?.length > 0){
        formData.append("coverImage", data.coverImage[0])
    }

    // api response

   try {
     const response = await axiosInstance.post("/users/register", formData)
     console.log(response.data);
     toast.success("Registerd successfully!!")
     return response.data
   } catch (error) {
     
     toast.error(error?.response?.data?.error)
     throw error;
   }
} )


export const userLogin = createAsyncThunk("auth/login", async (data) => {
        try {
            const response = await axiosInstance.post("/users/login", data)
            return response.data.data.user;
        } catch (error) {
            toast.error(error?.response?.data?.error)
            throw error
        }
})



export const userLogout = createAsyncThunk("auth/logout", async (data) => {

    try {
         const response = await axiosInstance.post("/users/logout")
         toast.success(response.data?.message)
         return response.data
    } catch (error) {
         toast.error(error?.response?.data?.error);
         throw error;
    }
})

export const refreshAccessToken = createAsyncThunk("auth/refreshAccessToken", async(data) => {

  try {
      const response = await axiosInstance.post("/users/refresh-token", data)
      return response.data
  } catch (error) {
    toast.error(error?.response?.data?.error);
            throw error;
  }
})

export const changePassword = createAsyncThunk("auth/changePassword", async(data) => {

    try {
        const response = await axiosInstance.post("/users/change-password", data)
        toast.success(response.data?.message)
        return response.data
    } catch (error) {
        toast.error(error?.response?.data?.error);
        throw error;
    }
})

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async() => {

    const response = await axiosInstance.get("/users/current-user", { withCredentials: true })
    return response.data.data
})

export const updateAvatar = createAsyncThunk("auth/updateAvatar", async(avatar) => {

   try {
     const response = await axiosInstance.patch("/users/avatar", avatar)
     toast.success("details updated successfully!!")
     return response.data.data
   } 
   catch (error) {
    toast.error(error?.response?.data?.error)
    throw error;
   }
})

export const updateCoverImg = createAsyncThunk("auth/updateCoverImg", async(coverImage) => {

   try {
     const response = await axiosInstance.patch("/users/cover-image", coverImage)
     toast.success(response.data.message)
     return response.data.data
   } catch (error) {
     toast.error(error?.response?.data?.error);
            throw error;
   }
})

export const updateUserDetails = createAsyncThunk("auth/updateUserDetails", async (data) => {

 try {
     const response = await axiosInstance.patch("/users/update-account", data)
     toast.success("details updated successfully")
     return response.data
 } catch (error) {
    toast.error(error?.response?.data?.error)
    throw error;
 }

})
// create asyncthunk -- talk to backend
// create slice -- redux state change 

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => { // thunk ka result extrareducers me aayega state me -- pending , fullfeild, rejected

 builder.addCase(createAccount.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createAccount.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createAccount.rejected, (state, action) => {
      state.loading = false;   
      state.status = false;
      state.userData = action.payload;
    }); 
  

   builder.addCase(userLogin.pending,
    (state) => {
        state.loading = true;
    }
   )
    builder.addCase(userLogin.fulfilled,
    (state, action) => {
        state.loading = false;
        state.status = true
        state.userData = action.payload
    }
   )
    builder.addCase(userLogin.rejected,
    (state, action) => {
        state.loading = false;
        state.status = false
        state.userData = action.payload
    }
   )

builder.addCase(userLogout.pending, (state) => {
    state.loading = true;
});
 builder.addCase(userLogout.fulfilled, (state) => {
    state.loading = false;
    state.status = false;
    state.userData = null;
});
builder.addCase(userLogout.rejected, (state, action) => {
    state.loading = false;
    state.status = false;
    state.userData = action.payload;
 });

 
builder.addCase(getCurrentUser.pending, (state) => {
    state.loading = true;
    });
builder.addCase(getCurrentUser.fulfilled, (state, action) => {
    state.loading = false;
    state.status = true;
    state.userData = action.payload;
    });
builder.addCase(getCurrentUser.rejected, (state) => {
    state.loading = false;
    state.status = false;
    state.userData = null;
    }); 

builder.addCase(updateAvatar.pending, (state) => {
    state.loading = true;
        });
builder.addCase(updateAvatar.fulfilled, (state, action) => {
    state.loading = false;
    state.userData = action.payload;
        });
builder.addCase(updateAvatar.rejected, (state) => {
    state.loading = false;
        });
        
builder.addCase(updateCoverImg.pending, (state) => {
    state.loading = true;
        });
builder.addCase(updateCoverImg.fulfilled, (state, action) => {
    state.loading = false;
    state.userData = action.payload;
        });
builder.addCase(updateCoverImg.rejected, (state) => {
    state.loading = false;
        });

builder.addCase(changePassword.pending, (state) => {
    state.loading = true;
    });
builder.addCase(changePassword.fulfilled, (state, action) => {
    state.loading = false,
    state.status = true,
    state.userData = action.payload;
    });
builder.addCase(changePassword.rejected, (state, action) => {
    state.loading = false,
    state.status = false,
    state.userData = null;
      
    })        

builder.addCase(updateUserDetails.pending, (state) => {
    state.loading = true;
}); 
builder.addCase(updateUserDetails.fulfilled, (state, action) => {
    state.status = true;
    state.loading = false;
    state.userData = action.payload;
    });
builder.addCase(updateUserDetails.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
      state.updateUserDetailsError = action.payload;
    });

}
})

export default authSlice.reducer;


