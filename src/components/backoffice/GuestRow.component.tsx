import type { Guest } from "@/model/guest.data"
import { useState } from "react";

const GuestRow: React.FC<{initialGuest: Guest, index: number}> = ({initialGuest, index}) => {
  const [guest, setGuest] = useState(initialGuest);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <tr>
      <th scope="row">{index}</th>
      <td>
        {isEditing ? (
          <input type="text" value={guest.reference} onChange={(e) => setGuest({...guest, reference: e.target.value})} className="m-1 form-control"/>
        ) : (
          guest.reference
        )}
      </td>
      <td>
        {isEditing ? (
          <>
          <input type="text" value={guest.firstName} onChange={(e) => setGuest({...guest, firstName: e.target.value})} className="m-1 form-control"/>
          <input type="text" value={guest.lastName} onChange={(e) => setGuest({...guest, lastName: e.target.value})} className="m-1 form-control"/>
          </>
        ) : (
          guest.firstName + ' ' + guest.lastName
        )}
      </td>
      <td>
        {isEditing ? (
          <>
            <input type="checkbox" 
              checked={guest.confirmed} 
              onChange={(e) => setGuest({...guest, confirmed: e.target.checked})} 
              className="btn-check"
              id={`confirmed-${index}`}
            />
            <label className="btn btn-outline-secondary" htmlFor={`confirmed-${index}`}>Confirmado</label>
          </>
        ) : (
            <p className={`${guest.confirmed ? 'text-success' : 'text-secondary'}`}>
              {guest.confirmed ? 'si' : 'aún no'}
            </p>
        )}
      </td>
      <td>
        {isEditing ? (
          <>
            <input type="checkbox" 
              checked={guest.attendance} 
              onChange={(e) => setGuest({...guest, attendance: e.target.checked})} 
              className="btn-check"
              id={`attendance-${index}`}
            />
            <label className="btn btn-outline-secondary" htmlFor={`checked-${index}`}>Asistrá</label>
          </>
        ) : (
          guest.attendance ? 'Asistirá' : guest.confirmed ? 'No Asistirá' : 'No Confirmado aún'
        )}
      </td>
      <td>
        {isEditing ? (
          <>
            <input type="checkbox" 
              checked={guest.checked} 
              onChange={(e) => setGuest({...guest, checked: e.target.checked})} 
              className="btn-check"
              id={`checked-${index}`}
            />
            <label className="btn btn-outline-secondary" htmlFor={`checked-${index}`}>Chequeado</label>
          </>
        ) : (
          guest.checked ? 'Chequeado' : 'No Chequeado'
        )}
      </td>
      <td>
        {isEditing ? (
          <>
            <input type="checkbox" 
              checked={guest.stayAtHotel} 
              onChange={(e) => setGuest({...guest, stayAtHotel: e.target.checked})} 
              className="btn-check"
              id={`stayAtHotel-${index}`}
            />
            <label className="btn btn-outline-secondary" htmlFor={`stayAtHotel-${index}`}>Se hospedará</label>
          </>
        ) : (
          guest.stayAtHotel ? 'Se hospedará' : guest.confirmed ? 'No se hospedará' : 'No Confirmado aún'
        )}
      </td>
      <td>
        <button onClick={() => setIsEditing(!isEditing)} className="btn btn-primary">{isEditing ? 'Save' : 'Edit'}</button>
      </td>
    </tr>
  )
}

export default GuestRow;
