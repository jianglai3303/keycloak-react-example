/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Contact Indoc Systems for any questions regarding the use of this source code.
 */
/*/
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Contact Indoc Systems for any questions regarding the use of this source code.
 */
import { embedDashboard } from '@superset-ui/embedded-sdk';
import React, { useEffect, useRef } from 'react';
import styles from './index.module.css';
import { kc } from './keycloak';
const DASHBOARD_ID = 'dfd29b5f-292f-41af-8148-2e8296692ebd';
const EmbeddedDashboard = () => {
  const dashboardRef = useRef();
  const token = kc.token;
  console.log('token in embedded dashboard:', token);
  useEffect(() => {
    const mountPoint = dashboardRef.current;

    if (!mountPoint) {
      return;
    }

    (async () => {
      try {
        const payload = {
          accessToken: token,
          dashboardId: DASHBOARD_ID
        };

        const response = await fetch('http://localhost:3001/api/guest-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to fetch guest token from backend',
          );
        }
        const data = await response.json();

        await embedDashboard({
          id: DASHBOARD_ID,
          supersetDomain: 'http://localhost:8088',
          mountPoint, // Use the ref's current value here
          fetchGuestToken: () => data.token,
          dashboardUiConfig: {
            // hideTitle: true,
            filters: {
              expanded: true,
            },
          },
        });
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <div className={styles['embedded-dashboard']} ref={dashboardRef}></div>
  );
};

export default EmbeddedDashboard;