import React, { useMemo, createContext } from "react";
import { useFormController } from "../../../../hooks/controllers/postSubmission/useFormController";
import { MainPostControllerInputs } from "./MainPostControllerInputs";
import { usePostControls } from "../../../../hooks/controllers/postSubmission/usePostControls";
import { MainPostControllerControls } from "./MainPostControllerControls";
import { PostsList } from "../postsList/PostsList";

// DDD - domain driven development

export type ITitleLinkSublistValidation = {
  isTitleValidated: boolean;
  isLinkValidated: boolean;
  isSubListValidated: boolean;
};

export interface IMainControllerConfig {
  updaterModule: boolean;
  schedulerModule: boolean;
  isLocked: boolean;
  additionalDetails?: string;
}

const usePostStore = {};

// import createStoreA from "...";
// import createStoreB from "...";

// const createStoreA = (set, get) => ({
//   counter: 10,
//   increment: () => set((store) => store.counter++),
// });

// const useStore = create((set, get, api) => ({
//   ...createStoreA(set, get, api),
//   ...createStoreB(set, get, api),
// }));

const PostStore = createContext(usePostStore.getState());

const usePostStoreGetter = useContext(PostStore);

export const MainPostController = ({
  controllerConfig,
}: {
  controllerConfig: IMainControllerConfig;
}) => {
  const state = usePostStore();

  const config = useFormController();

  const {
    // potentially global?
    isMainPostControllerFullyValidated,
    isAnySubmitted,
    // global?
    debouncedStatus,

    // global --??
    subsList,
    isLinkValidated,
    isTitleValidated,
    isSubListValidated,
    // global --??

    setLocalChangeTriggered,
    isAnyInputSubmitting,
    setIsAnyInputSubmitting,
    publish,
    shouldDisplayList,
  } = usePostControls(config);

  const validation = useMemo(() => {
    return {
      isTitleValidated: isTitleValidated,
      isLinkValidated: isLinkValidated,
      isSubListValidated: isSubListValidated,
    };
  }, [isTitleValidated, isLinkValidated, isSubListValidated]);

  return (
    <div>
      <PostStore.Provider value={state}>
        <h1>Setup Your Post</h1>
        <div>
          Are all validated? {isMainPostControllerFullyValidated ? "YES" : "NO"}
        </div>

        <div>
          {/* *************** */}
          <MainPostControllerInputs
            inputsConfig={config}
            validation={validation}
          />
          {/* *************** */}
          {/* ****** BUTTONS ******* */}
          {/* *************** */}

          <MainPostControllerControls
            {...{
              isAnySubmitted,
              isMainPostControllerFullyValidated,
              debouncedStatus,
              isAnyInputSubmitting,
              setIsAnyInputSubmitting,
              publish,
            }}
          />

          {/* *************** */}
          {/* ****** POSTS LIST ******* */}
          {/* *************** */}

          {shouldDisplayList ? (
            <div>
              <PostsList
                {...{
                  subsList,
                  config,
                  setLocalChangeTriggered,
                  isAnyInputSubmitting,
                  setIsAnyInputSubmitting,
                  isMainPostControllerFullyValidated,
                  debouncedStatus,
                  isAnySubmitted,
                  publish,
                  controllerConfig,
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </PostStore.Provider>
    </div>
  );
};
