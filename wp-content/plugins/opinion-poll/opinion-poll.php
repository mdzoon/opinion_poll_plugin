<?php 
/**
 * @package Opinion_Poll
 * @version 1.0.0
 */
/*
Plugin name: Opinion Poll Plugin
Description: Live-updating opinion polls for Wordpress website
Version: 1.0.0
Author: mdzoon
Author URI: https://michaeldyczkowski.co.uk
*/

if ( !class_exists( 'Opinion Poll' ) ) {
    class OpinionPoll {
        
        private $shortcode_name = 'opinion-poll';

        public function register() {
            add_shortcode( $this->shortcode_name, [$this, 'shortcode'] );
            add_action( 'wp_enqueue_scripts', [$this, 'scripts'] );
            add_action( 'wp_ajax_nopriv_submit_opinion_poll_data', [$this, 'submit_poll_data'] );
            add_action( 'wp_ajax_nopriv_get_opinion_poll_data', [$this, 'get_poll_data'] );
        }
        public function shortcode( $atts ) { 
            $answers = [];
            
            foreach ( $atts as $key => $val ) {
                if( strstr( $key, 'answer-' ) ) {
                    $answers[ str_replace( 'answer-', '', $key ) ] = $val;
                }
            } 
            $data_atts = esc_attr( json_encode(
                [
                    'id'       => sanitize_title_with_dashes( $atts['id'], '', 'save' ),
                    'question' => $atts['question'],
                    'answers'  => $answers,
                ]
            ));
            
            return "<div id='opinion-poll' data-poll-atts='{$data_atts}'>
                        <button id='opinion-poll-btn' class='btn btn-primary'>Take a part in our opinion poll</button>
                    </div>";
        }
        // Only enqueue scripts if we're displaying a post that contains the shortcode 
        public function scripts() {

            global $post;

            if( is_object($post) ) {
                if( isset( $post->post_content, $this->shortcode_name ) && has_shortcode( $post->post_content, $this->shortcode_name ) ) {
                    wp_enqueue_script( 'opinion-poll', plugin_dir_url( __FILE__ ) . 'js/opinion-poll.js', [], '0.1', true );
                    wp_add_inline_script( 'opinion-poll', 'window.ajaxurl = "' . admin_url( 'admin-ajax.php' ) . '"');
                    wp_enqueue_style( 'opinion-poll', plugin_dir_url( __FILE__ ) . 'css/opinion-poll.css', [], '0.1' );
                    wp_enqueue_style( 'op-bootstrap', "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css");
                }
            }
        }
        public function submit_poll() {
            $id = sanitize_title_with_dashes( $_GET['id'], '', 'save' );
            $answer = sanitize_text_field( $_GET['answer'] );
            $option_name = 'opinion-poll_' . $id;
            $option_value = get_option( $option_name, [] );
            $answer_count = isset( $option_value[ $answer ] ) ? $option_value[ $answer ] : 0;
            $option_value[ $answer ] = $answer_count + 1;
            update_option( $option_name, $option_value );
            exit( 'success' );
        }
        public function get_poll_data() {
            $id = sanitize_title_with_dashes( $_GET['id'], '', 'save' );
            $option_name = 'opinion-poll_' . $id;
            $option_value = get_option( $option_name, [] );
            exit( json_encode( $option_value ) );
        }
    }
    ( new OpinionPoll() )->register();
} 