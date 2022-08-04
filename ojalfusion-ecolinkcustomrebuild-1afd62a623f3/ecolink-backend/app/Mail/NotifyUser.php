<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotifyUser extends Mailable
{
    use Queueable, SerializesModels;
    public $user;
    public $files;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user)
    {
        $this->user = $user;
        $this->files = $user->documents;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->markdown('emails.notifyuser')
            ->from('developerecolink@gmail.com', 'ecolink')
            ->subject('Tax Exempted');
        foreach($this->files as $file) {
            $this->attach($file);
        }
        return $this;    
    }
}
