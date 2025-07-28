import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/auth-slice";
import userReducer from "@/redux/slices/user-slice";
import categoryReducer from "@/redux/slices/category-slice";
import coinReducer from "@/redux/slices/coin-slice";
import countryReducer from "@/redux/slices/country-slice";
import comicReducer from "@/redux/slices/comic-slice";
import chapterReducer from "@/redux/slices/chapter-slice";
import actionreducer from "@/redux/slices/action-slice";
import commentReducer from "@/redux/slices/comment-slice";
import comichistoryReducer from "@/redux/slices/comic-history-slice";
import transitionReducer from "@/redux/slices/transition-slice";
import notificationReducer from "@/redux/slices/notification-slice";
import searchReducer from "@/redux/slices/search-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    category: categoryReducer,
    coin: coinReducer,
    country: countryReducer,
    comic: comicReducer,
    chapter: chapterReducer,
    action: actionreducer,
    comment: commentReducer,
    comichistory: comichistoryReducer,
    transition: transitionReducer,
    notification: notificationReducer,
    search: searchReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
