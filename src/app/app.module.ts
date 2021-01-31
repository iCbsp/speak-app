import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Menu desplegable
import { MenuComponent } from './components/menu/menu.component';

// STT
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

// TTS
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

// SQLite
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { DatabaseService } from './services/databaseService';

// Popover
import { UsuarioPopoverPageModule } from 'src/app/components/usuario-popover/usuario-popover.module';
import { AccionPopoverPageModule } from 'src/app/components/accion-popover/accion-popover.module';

@NgModule({
  declarations: [AppComponent, MenuComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, UsuarioPopoverPageModule, AccionPopoverPageModule],
  exports: [MenuComponent],
  providers: [
    StatusBar,
    SplashScreen,
    SpeechRecognition, TextToSpeech, // TTS y SST
    DatabaseService, // SQLite
    SQLite, //SQLiteObject,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
