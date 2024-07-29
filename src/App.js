import React, { useEffect } from 'react';
import PowerUp from './components/PowerUp';

function App() {
  useEffect(() => {
    window.TrelloPowerUp.initialize({
      'board-buttons': function(t, options) {
        return [{
          icon: {
            dark: 'https://trello-report.netlify.app/logo512.png',
            light: 'https://trello-report.netlify.app/logo512.png'
          },
          text: 'Trello Lens',
          callback: function(t) {
            return t.popup({
              title: 'AI Report Generator',
              url: t.signUrl('./index.html'),
              width: 340,
              height: 400,
            });
          }
        }];
      }
    });
  }, []);

  return (
    <div className="App">
      <PowerUp />
    </div>
  );
}

export default App;