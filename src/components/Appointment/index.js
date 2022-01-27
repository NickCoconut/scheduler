import React from "react";
import useVisualMode from "hooks/useVisualMode";
import "components/Appointment/styles.scss";

import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CANCEL = "CANCEL";
const DELETE = "DELETE";
const EDIT = "EDIT";
const ERROR_SAVING = "ERROR_SAVING";
const ERROR_DELETING = "ERROR_DELETING";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVING, true));
  }

  function deleteAppointment() {
    transition(DELETE, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETING, true));
  }

  function cancelConfirmation() {
    transition(CANCEL);
  }

  function edit() {
    transition(EDIT);
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={cancelConfirmation}
          onEdit={edit}
        />
      )}
      {mode === CANCEL && (
        <Confirm
          message="Are you sure?"
          onConfirm={deleteAppointment}
          onCancel={back}
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer["id"]}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === CREATE && (
        <Form interviewers={props.interviewers} onCancel={back} onSave={save} />
      )}
      {mode === ERROR_SAVING && (
        <Error message="Could not save." onClose={() => back()} />
      )}
      {mode === ERROR_DELETING && (
        <Error message="Could not delete." onClose={() => back()} />
      )}
      {mode === DELETE && <Status message="DELETING..." />}
      {mode === SAVING && <Status message="SAVING..." />}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    </article>
  );
}