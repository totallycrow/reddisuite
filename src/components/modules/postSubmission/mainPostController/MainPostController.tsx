import React, { useMemo } from "react";
import { useFormController } from "../../../../hooks/controllers/postSubmission/useFormController";
import { MainPostControllerInputs } from "./MainPostControllerInputs";
import { usePostControls } from "../../../../hooks/controllers/postSubmission/usePostControls";
import { MainPostControllerControls } from "./MainPostControllerControls";
import { PostsList } from "../postsList/PostsList";

export type ITitleLinkSublistValidation = {
  isTitleValidated: boolean;
  isLinkValidated: boolean;
  isSubListValidated: boolean;
};

export interface IMainControllerConfig {
  schedulerModule: boolean;
}

export const MainPostController = ({
  controllerConfig,
}: {
  controllerConfig: IMainControllerConfig;
}) => {
  const config = useFormController();

  const {
    isMainPostControllerFullyValidated,
    isAnySubmitted,
    debouncedStatus,
    subsList,
    clean,
    isLinkValidated,
    isTitleValidated,
    isSubListValidated,
    setLocalChangeTriggered,
    isAnyInputSubmitting,
    setIsAnyInputSubmitting,
    publish,
  } = usePostControls(config);

  const validation = useMemo(() => {
    return {
      isTitleValidated: isTitleValidated,
      isLinkValidated: isLinkValidated,
      isSubListValidated: isSubListValidated,
    };
  }, [isTitleValidated, isLinkValidated, isSubListValidated]);

  console.log(
    "**************************************************************************************************"
  );
  console.log(controllerConfig);

  return (
    <div>
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

        <PostsList
          {...{
            subsList,
            clean,
            validation,
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
    </div>
  );
};
