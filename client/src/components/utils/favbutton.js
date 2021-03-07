import React from 'react'

import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faHeart from '@fortawesome/fontawesome-free-solid/faHeart'

const FavButton = ({ uid, jobId, addFav, rmFav, userFavourites }) =>
  userFavourites.includes(jobId) ? (
    <OverlayTrigger
      placement={'bottom'}
      overlay={<Tooltip>Αφαίρεση απ'τα αγαπημένα</Tooltip>}
    >
      <FontAwesomeIcon
        onClick={(e) => rmFav(e, jobId, uid)}
        icon={faHeart}
        className="src_fa"
      />
    </OverlayTrigger>
  ) : (
    <OverlayTrigger
      placement={'bottom'}
      overlay={<Tooltip>Προσθήκη στα αγαπημένα</Tooltip>}
    >
      <FontAwesomeIcon
        onClick={(e) => addFav(e, jobId, uid)}
        icon={faHeart}
        className="src_fa_nofav"
      />
    </OverlayTrigger>
  )

export default FavButton
